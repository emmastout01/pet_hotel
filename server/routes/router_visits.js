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

//post
router.post('/', function (req, res) {
  var newVisit = req.body;
  pool.connect(function (errorConnecting, db, done) {
    if (errorConnecting) {
      console.log('Error connecting', errorConnecting);
      res.send(500);
    } else {
      var queryText = 'INSERT INTO "visits" ("checkin", "pet_id") VALUES ($1, $2);';
      db.query(queryText, [newVisit.checkin, newVisit.pet_id], function (errorMakingQuery, result) {
        done();
        if (errorMakingQuery) {
          console.log(errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });
    }
  });//end pool
});//end put route

//put
router.put('/:id', function (req, res) {
  var id = req.params.id;
  var visitUpdate = req.body;
  console.log(id);
  pool.connect(function (errorConnecting, db, done) {
    if (errorConnecting) {
      console.log('Error connecting', errorConnecting);
      res.send(500);
    } else {
      var queryText = 'UPDATE "visits" SET "checkout" = $1 WHERE "id" =' + id + ';';
      db.query(queryText, [visitUpdate.checkout], function (errorMakingQuery, result) {
        done();
        if (errorMakingQuery) {
          console.log(errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });
    }
  });//end pool
});//end put route

var poolModule = require('../modules/pool.js');
var pool = poolModule;

module.exports = router;