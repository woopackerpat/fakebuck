const { FRIEND_ACCEPTED, FRIEND_PENDING} = require('../config/constants')

module.exports = (sequelize, DataTypes) => {
    const Friend = sequelize.define(
      "Friend",
      {
          status: {
              type: DataTypes.ENUM(FRIEND_ACCEPTED, FRIEND_PENDING),
              allowNull: false,
              defaultValue: 'PENDING',
              validate: {
                  notEmpty: true
              }
          }
      },
      {
        underscored: true,
      }
    );

    Friend.associate = (models) => {
        Friend.belongsTo(models.User, {
            as: 'RequestFrom',
          foreignKey: {
            allowNull: false,
            name: "requestFromId",
            
          },
          onUpdate: "RESTRICT",
          onDelete: "RESTRICT",
        });

        Friend.belongsTo(models.User, {
            as: 'RequestTo',
          foreignKey: {
            allowNull: false,
            name: "requestToId",
            
          },
          onUpdate: "RESTRICT",
          onDelete: "RESTRICT",
        });
      };
    
    return Friend;
  };
  