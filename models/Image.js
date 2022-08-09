const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    "Image",
    {
      image: DataTypes.STRING,
    },
    {
      underscored: true,
    }
  );
  Image.associate = (models) => {
    Image.belongsTo(models.Post, {
      foreignKey: {
        allowNull: false,
        name: "postId",
      },
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };
  return Image;
};
