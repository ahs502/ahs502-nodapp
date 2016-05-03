var config = require("../config");

var router = require('express').Router(); // or .RouterFor('/')

// See: https://gist.github.com/azat-co/6075685
// See: https://gist.github.com/fengmk2/1194742
var mongo = require("mongoskin");

///////////////////////////////////////////////////////////////


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        //offline: true
    });
});


///////////////////////////////////////////////////////////////

module.exports = router;
