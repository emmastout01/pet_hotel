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

// var pool = new pg.Pool(config);

module.exports = router;