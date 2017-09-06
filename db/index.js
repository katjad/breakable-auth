module.exports = function(app){
  var sequelize = require('./dbconnect');
  var User = require('../models/users');
  var Item = require('../models/items');
  console.log("storage", sequelize.options.storage);
  sequelize
    .authenticate()
    .then(() => {
    console.log('Connection has been established successfully.');
    })
    .catch(err => {
    console.error('Unable to connect to the database:', err);
    });
}


// katjad, gicela, wingedeel, rinse0ut, mjg17, nat47, timhandy, archdd, dandel10n, me--2014, trianah, hvarley, dillonkeithdiep

