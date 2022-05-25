const createError = require("../utils/createError");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const { Post, Like, sequelize } = require("../models");

exports.createPost = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title && !req.file) {
      createError("title or image is required", 400);
    }
    let image;
    if (req.file) {
      const result = await cloudinary.upload(req.file.path);
      image = result.secure_url;
    }

    const post = await Post.create({ title, image, userId: req.user.id });
    res.json({ post });
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
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
  try {
  } catch (err) {
    next(err);
  }
};
