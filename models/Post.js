module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      title: DataTypes.STRING,
      image: DataTypes.STRING,
      like: DataTypes.INTEGER.UNSIGNED,
    },
    {
      underscored: true,
    }
  );
  return Post;
};
