module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define(
      "Like",
      {},
      {
        underscored: true,
      }
    );

    Like.associate = (models) => {
        Like.belongsTo(models.User, {
          foreignKey: {
            allowNull: false,
            name: "userId",
            
          },
          onUpdate: "RESTRICT",
          onDelete: "RESTRICT",
        });

        Like.belongsTo(models.Post, {
            foreignKey: {
              allowNull: false,
              name: "postId",
              
            },
            onUpdate: "RESTRICT",
            onDelete: "RESTRICT",
          });
      };

      
    return Like;
  };
  