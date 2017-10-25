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

//get owners & pets
router.get('/', function (req, res) {
  pool.connect(function (errorConnecting, db, done) {
    if (errorConnecting) {
      console.log('Error connecting ', errorConnecting);
      res.sendStatus(500);
    } else {
      //select owner, pet, breed, color, checkin, and checkout
      var queryText = 'SELECT "owners"."first", "owners"."last", "pets"."name", "pets"."breed", "pets"."color", "visits"."checkin", "visits"."checkout", "pets"."owner_id", "visits"."pet_id", "visits"."id" FROM "owners" JOIN "pets" ON "owners"."id" = "pets"."owner_id" JOIN "visits" ON "pets"."id" = "visits"."pet_id";';
      db.query(queryText, function (errorMakingQuery, result) {
        done();
        if (errorMakingQuery) {
          console.log('errorMakingQuery', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.send(result.rows);
        }
      });
    }
  });//end of pool
});//end of get


//delete a pet history and pet
router.delete('/:id', function (req, res) {
  var petId = req.params.id;
  pool.connect(function (errorConnecting, db, done) {
    if (errorConnecting) {
      console.log('Error connecting ', errorConnecting);
      res.sendStatus(500);
    } else {
      var queryText = 'DELETE FROM "visits" WHERE  "pet_id" = $1; DELETE FROM "pets" WHERE "id" = $1;';
      db.query(queryText,[petId], function (errorMakingQuery, result) {
        done();
        if (errorMakingQuery) {
          console.log('errorMakingQuery', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.send(201);
        }
      });
    }
  });//end of pool
});//end of delete

//post to add a pet
router.post('/', function (req, res) {
  var newPet = req.body;
  pool.connect(function (errorConnecting, db, done) {
    if (errorConnecting) {
      console.log('Error connecting ', errorConnecting);
      res.sendStatus(500);
    } else {
      var queryText = 'INSERT INTO "pets" ("name", "breed", "color", "owner_id") VALUES($1, $2, $3, $4)';
      db.query(queryText, [newPet.name, newPet.breed, newPet.color, newPet.owner_id], function (errorMakingQuery, result) {
        done();
        if (errorMakingQuery) {
          console.log('errorMakingQuery', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.send(201);
        }
      });
    }
  });//end of pool
});//end of post

//put updates pets
router.put('/:id', function (req, res) {
  var petId= req.params.id;
  var petUpdate = req.body;
  pool.connect(function (errorConnecting, db, done) {
    if (errorConnecting) {
      console.log('Error connecting ', errorConnecting);
      res.sendStatus(500);
    } else {
      var queryText = 'UPDATE "pets" SET "name" = $1, "breed" = $2, "color" = $3 WHERE "id" = $4;';
      db.query(queryText,[petUpdate.name, petUpdate.breed, petUpdate.color, petId], function (errorMakingQuery, result) {
        done();
        if (errorMakingQuery) {
          console.log('errorMakingQuery', errorMakingQuery);
          res.sendStatus(500);
        } else {
          res.send(201);
        }
      });
    }
  });//end of pool
});//end of put

module.exports = router;