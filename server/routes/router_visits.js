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
  var petId = req.body;
  pool.connect(function (errorConnecting, db, done) {
    if (errorConnecting) {
      console.log('Error connecting', errorConnecting);
      res.send(500);
    } else {
      var queryText = 'INSERT INTO "visits" ("pet_id") VALUES ($1);';
      db.query(queryText, [petId.id], function (errorMakingQuery, result) {
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
});//end post route

//put
router.put('/', function (req, res) {
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

//get rout to get pet name check in and check out & visit.id
router.get('/', function (req, res) {
  pool.connect(function (errorConnecting, db, done) {
    if (errorConnecting) {
      console.log('Error connecting', errorConnecting);
      res.send(500);
    } else {
      var queryText = 'SELECT "visits"."id", "pets"."name", "visits"."checkin", "visits"."checkout" FROM "visits" JOIN "pets" ON "pets"."id" = "visits"."pet_id" ORDER BY "visits"."checkout" DESC;';
      db.query(queryText, function (errorMakingQuery, result) {
        done();
        if (errorMakingQuery) {
          console.log(errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    }
  });//end pool
});//end put route

//delete a pet visit
router.delete('/:id', function (req, res) {
  var petId = req.params.id;
  pool.connect(function (errorConnecting, db, done) {
    if (errorConnecting) {
      console.log('Error connecting ', errorConnecting);
      res.sendStatus(500);
    } else {
      var queryText = 'DELETE FROM "visits" WHERE  "id" = $1;';
      db.query(queryText,[petId], function (errorMakingQuery, result) {
        done();
        if (errorMakingQuery) {
          console.log('errorMakingQuery', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });
    }
  });//end of pool
});//end of delete

var poolModule = require('../modules/pool.js');
var pool = poolModule;

module.exports = router;