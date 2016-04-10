var router = require('express').Router();

// router.routeBase = '/';

var config = require("../config");

///////////////////////////////////////////////////////////////


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        config: config,
        //offline: true
    });
});


///////////////////////////////////////////////////////////////

module.exports = router;
