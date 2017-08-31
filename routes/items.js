var express = require('express');
var router = express.Router();
var Item = require('../models/items')

/* GET users listing. */
router.get('/items', function(req, res, next) {
  res.render('items', { title: "All items"});
});

router.get('/item/:id/', function(req, res, next){
    Item.findAll({
        where: {
            id: req.params.id
        }
    }).then((items) => { res.render('item', {items: items})});    
})

module.exports = router;
