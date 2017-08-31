var Sequelize = require('sequelize');
var sequelize = require('../../db/dbconnect');

const Item = sequelize.define('item', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
        unique: true
    },
    link: {
        type: Sequelize.STRING
    },
    user_id: {
        type: Sequelize.INTEGER
    }
})

module.exports = Item;