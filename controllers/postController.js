const createError = require("../utils/createError");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const { Post, Like, sequelize, Comment, User, Image } = require("../models");
const FriendService = require("../services/friendService");

exports.createPost = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title && !req.files) {
      createError("title or image is required", 400);
    }

    if (req.files) {
      const files = req.files;
      const post = await Post.create({ title, userId: req.user.id });

      const results = await Promise.all(
        files.map(async (el) => {
          try {
            const result = await cloudinary.upload(el.path);
            return { image: result.secure_url, postId: post.id };
          } catch {
            next(err);
          } finally {
            fs.unlinkSync(el.path);
          }
        })
      );

      const imageUrls = await Image.bulkCreate(results);

     

      // const result = await cloudinary.upload(req.files.path);
      // image = result.secure_url;
    }

    // const imagesUrl = await Image.bulkCreate()
    // res.json({ post });
  } catch (err) {
    next(err);
  } finally {
    // if (req.file) {
    //   fs.unlinkSync(req.file.path);
    // }
  }
};

exports.createLike = async (req, res, next) => {
  const t = await sequelize.transaction(); //start transaction
  try {
    // check ว่าว่าไลค์แล้วหรือยัง ไม่ต้อง check post เพราะมี validator
    const { postId } = req.params;
    const existLike = await Like.findOne({
      where: {
        postId,
        userId: req.user.id,
      },
    });

    if (existLike) {
      createError("you already liked this post", 400);
    }
    const post = await Post.findOne({ where: { id: postId } });

    if (!post) {
      createError("post not found", 400);
    }

    // ต้องใช้ transaction (การสร้างเซ็ตในคำสั่ง sql) คล้ายๆ promise
    const like = await Like.create(
      {
        postId,
        userId: req.user.id,
      },
      { transaction: t }
    );

    await post.increment({ like: 1 }, { transaction: t });
    await t.commit();

    res.json({ like });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.deleteLike = async (req, res, next) => {
  const t = await sequelize.transaction(); //start transaction
  try {
    const { postId } = req.params;
    const like = await Like.findOne({
      where: {
        postId,
        userId: req.user.id,
      },
    });

    if (!like) {
      createError("you already liked this post", 400);
    }
    const post = await Post.findOne({ where: { id: postId } });

    if (!post) {
      createError("post not found", 400);
    }

    await like.destroy({ transaction: t });
    await post.decrement({ like: 1 }, { transaction: t });
    await t.commit();

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const { id } = req.params;
    const post = await Post.findOne({ where: { id } });
    if (!post) {
      createError("post not found", 400);
    }
    if (post.userId !== req.user.id) {
      createError("you have no permission", 403);
    }
    await Comment.destroy({ where: { postId: id } }, { transaction: t });
    await Like.destroy({ where: { postId: id } }, { transaction: t });
    if (post.image) {
      const splited = post.image.split("/");
      const publicId = splited[splited.length - 1].split(".")[0];
      await cloudinary.destroy(publicId);
    }
    await Post.destroy({ where: { id } }, { transaction: t });
    await t.commit();
    res.status(204).json();
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    if (!title && !req.file) {
      createError("title or image is required", 400);
    }

    const post = await Post.findOne({ where: { id } });
    if (!post) {
      createError("post not found", 400);
    }

    if (post.userId !== req.user.id) {
      createError("you have no permission", 403);
    }

    if (req.file) {
      if (post.image) {
        const splited = post.image.split("/");
        const publicId = splited[splited.length - 1].split(".")[0];
        await cloudinary.destroy(publicId);
      }
      const result = await cloudinary.upload(req.file.path);
      post.image = result.secure_url;
    }
    if (title) {
      post.title = title;
    }
    await post.save();
    res.json({ post });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

exports.getUserPost = async (req, res, next) => {
  try {
    //   SELECT * FROM posts WHERE user_id IN (myId, ...friendId) ถ้้า userId เป็ฯ array จะเปลี่ยนเป็ฯ IN ให้อัตนโนมัติ
    const userId = await FriendService.findFriendId(req.user.id);
    console.log(userId);
    userId.push(req.user.id);
    const posts = await Post.findAll({
      attributes: {
        exclude: ["createdAt", "userId"],
      },
      where: { userId },
      order: [["updatedAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: {
            exclude: [
              "password",
              "email",
              "phoneNumber",
              "coverPhoto",
              "createdAt",
            ],
          },
        },
        {
          model: Comment,
          attributes: {
            exclude: ["createdAt", "userId"],
          },
          include: {
            model: User,
            attributes: {
              exclude: [
                "password",
                "email",
                "phoneNumber",
                "coverPhoto",
                "createdAt",
              ],
            },
          },
        },
        {
          model: Like,
          attributes: {
            exclude: ["createdAt"],
          },
          include: {
            model: User,
            attributes: {
              exclude: [
                "password",
                "email",
                "phoneNumber",
                "coverPhoto",
                "createdAt",
              ],
            },
          },
        },
      ],
    });
    res.json({ posts });
  } catch (err) {
    next(err);
  }
};
