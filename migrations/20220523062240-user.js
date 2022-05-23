"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("users", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      firstName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.DataTypes.STRING
      },
      profilePic: {
        type: Sequelize.DataTypes.STRING,
        
      },
      coverPhoto: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('users')
  },
};
