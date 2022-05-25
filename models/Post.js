module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      title: DataTypes.STRING,
      image: DataTypes.STRING,
      like: { type: DataTypes.INTEGER.UNSIGNED, defaltValue: 0 },
    },
    {
      underscored: true,
    }
  );
  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
        name: "userId",
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    Post.hasMany(models.Comment, {
      foreignKey: {
        allowNull: false,
        name: "postId",
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });

    Post.hasMany(models.Like, {
      foreignKey: {
        allowNull: false,
        name: "postId",
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };

  return Post;
};
