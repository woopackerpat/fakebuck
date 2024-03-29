const fs = require("fs");
const { User, Friend } = require("../models");
const FriendService = require("../services/friendService");
const cloudinary = require("../utils/cloudinary");
const createError = require("../utils/createError");
const { Op } = require("sequelize");

exports.getMe = async (req, res) => {
  const user = JSON.parse(JSON.stringify(req.user, null, 2));
  const friends = await FriendService.findAcceptedFriend(req.user.id);

  user.friends = friends;

  res.json({ user });
};

exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({
      where: { id: userId },
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      createError("user not found", 400);
    }

    const result = JSON.parse(JSON.stringify(user));
    const friends = await FriendService.findAcceptedFriend(user.id);
   

    result.friends = friends;

    //SELECT * FROM friends WHERE (requestToId = userId AND requestFrom Id = req.user.id) OR (requestToId = req.user.id AND requestFrom Id = userId)
    const friend = await Friend.findOne({
      where: {
        [Op.or]: [
          { requestToId: user.id, requestFromId: req.user.id },
          { requestToId: req.user.id, requestFromId: user.id },
        ],
      },
      attributes: ["status"],
    });
    result.friendStatus = friend;
    res.json({ user: result });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    // check ว่ามีไฟล์ไหม
    if (!req.files) {
      createError("profilePic or coverPhoto is required", 400);
    }

    const updateValue = {};

    if (req.files.profilePic) {
      const result = await cloudinary.upload(req.files.profilePic[0].path);
      if (req.user.profilePic) {
        const splited = req.user.profilePic.split("/");
        const publicId = splited[splited.length - 1].split(".")[0];
        await cloudinary.destroy(publicId);
      }
      updateValue.profilePic = result.secure_url;
    }

    if (req.files.coverPhoto) {
      const result = await cloudinary.upload(req.files.coverPhoto[0].path);
      if (req.user.coverPhoto) {
        const splited = req.user.coverPhoto.split("/");
        const publicId = splited[splited.length - 1].split(".")[0];
        await cloudinary.destroy(publicId);
      }
      updateValue.coverPhoto = result.secure_url;
    }

    await User.update(updateValue, { where: { id: req.user.id } });
    res.json({ ...updateValue });

    // const result = await cloudinary.upload(req.file.path)
    // await User.update(
    //   { profilePic: result.secure_url },
    //   { where: { id: req.user.id } }
    // );

    // fs.unlinkSync(req.file.path)

    // res.json({ profilePic: result.secure_url });

    // cloudinary.uploader.upload(req.file.path, async (error, result) => {
    //   if (error) {
    //     return next(error);
    //   }
  } catch (err) {
    next(err);
  } finally {
    if (req.files.profilePic) {
      fs.unlinkSync(req.files.profilePic[0].path);
    }

    if (req.files.coverPhoto) {
      fs.unlinkSync(req.files.coverPhoto[0].path);
    }
  }
};
