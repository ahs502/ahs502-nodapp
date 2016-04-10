var router = require('express').Router();

// router.routeBase = '/';

///////////////////////////////////////////////////////////////


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        //offline: true
    });
});


///////////////////////////////////////////////////////////////

module.exports = router;
