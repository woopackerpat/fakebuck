const { Comment } = require("../models");

exports.createComment = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { postId } = req.params;

    const comment = await Comment.create({
      title,
      postId,
      userId: req.user.id,
    });
    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
};
exports.updateComment = async (req, res, next) => {
  try {
    const { title } = req.body;
    const { id, postId } = req.params;

  } catch (err) {
    next(err);
  }
};
exports.deleteComment = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
