var config = require("../config");

var router = require('express').Router(); // or .RouterFor('/')

// See: https://gist.github.com/azat-co/6075685
// See: https://gist.github.com/fengmk2/1194742
var mongo = require("mongoskin");

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


router.post('/set/data', (req, res) => {
    var data = req.body;
    var db = mongo.db(config.database.connectionDb("test"));
    db.collection('ahs').insert(data, (err, result) => {
        if (err) {
            console.log("SET>ERROR:\n".red, err);
            res.send(err);
        }
        else {
            console.log("SET>DONE!\n".green, result);
            res.send(result);
        }
    });
});


router.post('/get/all', (req, res) => {
    var filter = req.body;
    var db = mongo.db(config.database.connectionDb("test"));
    db.collection('ahs').find(filter).toArray((err, result) => {
        if (err) {
            console.log("GET>ERROR:\n".red, err);
            res.send(err);
        }
        else {
            console.log("GET>DONE!\n".green, result);
            res.send(result);
        }
    });
});


router.post('/delete/all', (req, res) => {
    var filter = req.body;
    var db = mongo.db(config.database.connectionDb("test"));
    db.collection('ahs').remove(filter, (err, result) => {
        if (err) {
            console.log("DEL>ERROR:\n".red, err);
            res.send(err);
        }
        else {
            console.log("DEL>DONE!\n".green, result);
            res.send(result);
        }
    });
});


///////////////////////////////////////////////////////////////

module.exports = router;
