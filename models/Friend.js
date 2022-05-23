module.exports = (sequelize, DataTypes) => {
    const Friend = sequelize.define(
      "Friend",
      {
          title: {
              type: DataTypes.ENUM('ACCEPTED', 'PENDING'),
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
    return Friend;
  };
  