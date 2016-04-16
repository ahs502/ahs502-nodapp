var router = require('express').Router(); // or .RouterFor('/')

///////////////////////////////////////////////////////////////


// /* GET home page. */
// router.get('/', function(req, res, next) {
//     res.render('index', {
//         //offline: true
//     });
// });


router.get('/', function(req, res, next) {
    res.render('test', {
        //...
    });
});


///////////////////////////////////////////////////////////////

module.exports = router;
