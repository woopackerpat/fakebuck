module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define(
      "Comment",
      {
          title: {
              type: DataTypes.STRING,
              allowNull: false,
              validate: {
                  notEmpty: true
              }
          }
      },
      {
        underscored: true,
      }
    );

    Comment.associate = (models) => {
      Comment.belongsTo(models.Post, {
        foreignKey: {
          allowNull: false,
          name: "postId",
          
        },
        onUpdate: "RESTRICT",
        onDelete: "RESTRICT",
      });

      Comment.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
          name: "userId",
          
        },
        onUpdate: "RESTRICT",
        onDelete: "RESTRICT",
      });
    };

    
    return Comment;
  };
  