var router = require('express').Router(); // or .RouterFor('/')

///////////////////////////////////////////////////////////////


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        //offline: true
    });
});


///////////////////////////////////////////////////////////////

module.exports = router;
