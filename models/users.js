const {DataTypes} = require('sequelize')
const sequelize = require('./db')

const Users = sequelize.define('Users', {
    firstName: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    
})

