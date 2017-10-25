var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var bodyParser = require('body-parser');

// //Route paths
var petsRouter = require('./routes/router_pets.js');
var ownersRouter = require('./routes/router_owners.js');
var visitsRouter = require('./routes/router_visits.js');

// uses
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('server/public'));

// //routes
app.use('/pets', petsRouter);
app.use('/owners', ownersRouter);
app.use('/visits', visitsRouter);

app.listen(port, function() {
    console.log('listening on port', port);
})