const { Post,  Image } = require("../models");

exports.getAllPosts = async (req, res, next) => {
  try {
    
    const posts = JSON.parse(
      JSON.stringify(
        await Post.findAll({
          include: [Image],
          order: [["createdAt", "DESC"]],
        })
      )
    );
    res.status(200).json({ posts });
  } catch (err) {
    next(err);
  }
};
