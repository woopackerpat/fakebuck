'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("posts", {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      image: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      like: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        defaultValue: 0
      },
      userId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('posts')
  },
};

