var express = require('express');
var pg = require('pg');
var router = express.Router();

var config = {
  database: 'deneb',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};

var poolModule = require('../modules/pool.js');
var pool = poolModule;

//POST Route to add a new owner
router.post('/', function(req, res){
  var owner = req.body;
  pool.connect(function(errorConnectingToDB, db, done){
    if(errorConnectingToDB){
      console.log('POST connection error', errorConnectingToDB);
      res.sendStatus(500);
    } else {
      var queryText = 'INSERT INTO "owners" ("first", "last") VALUES ($1 $2);';
      db.query(queryText, [owner.firstName, owner.lastName], function(errorMakingQuery, result){
        done();
        if(errorMakingQuery){
          console.log('POST error', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      })
    }
  })
})

//GET Route to populate owners names in dropdown selection
router.get('/',function(req,res){
  pool.connect(function(errorConnectingToDB, db, done) {
    if(errorConnectingToDB){
        console.log('GET connction error', errorConnectingToDB);
        res.sendStatus(500);
    } else {
      var queryText = 'SELECT * FROM owners;';
      db.query(queryText, function(errorMakingQuery, result){
        done();
        if(errorMakingQuery){
          console.log('GET error', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    }
  });
});

module.exports = router;