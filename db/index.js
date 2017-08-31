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

    // User.sync({force: true}).then(() => {
    //     return User.create({
    //     username: 'spacegal',
    //     name: 'Katja',
    //     email: 'mail@example.com'
    //     });
    // }).then(() => {
    //     return User.findAll()
    // }).then(users =>console.log(users))

    // Item.sync({force: true}).then(() => {
    //     return Item.create({
    //         title: 'Let us learn about Promises',
    //         link: 'http://heres_a_link_to_google_doc'
    //     })
    // })
}


// katjad, gicela, wingedeel, rinse0ut, mjg17, nat47, timhandy, archdd, dandel10n, me--2014, trianah, hvarley, dillonkeithdiep

