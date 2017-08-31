var Sequelize = require('sequelize');
var sequelize = require('../../db/dbconnect');

const Rating = sequelize.define('rating', {
    id: {
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true
    },
    rating: {
        type: Sequelize.ENUM('+3','+2','+1','0','-1')
    },
    comment: {
        type: Sequelize.TEXT('tiny')
    },
    user_id: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
})

module.exports = Rating;