'use strict';

var path = require('path');
var express = require('express');
var config = require('./config')();

var app = express();

app.disable('etag');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('trust proxy', true);
//app.configure('development', function () { app.locals.pretty = true; });

// Processos
var processosModelo = require('./processos/processosModelo')(config);
app.use('/processos', require('./processos/crud')(processosModelo));
app.use('/api/processos', require('./processos/api')(processosModelo));
//var classesProcessuais = require('./processos/classesProcessuais');
//console.log(classesProcessuais);

// Redirect root to /books
app.get('/', function (req, res) {
  res.redirect('/processos');
});

// Basic 404 handler
app.use(function (req, res) {
  res.status(404).send('Not Found');
});

// Basic error handler
app.use(function (err, req, res, next) {
  /* jshint unused:false */
  console.error(err);
  // If our routes specified a specific response, then send that. Otherwise,
  // send a generic message so as not to leak anything.
  res.status(500).send(err.response || 'Something broke!');
});

if (module === require.main) {
  // Start the server
  var server = app.listen(config.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
  });
}

module.exports = app;
