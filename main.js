// =====================
// # /main.js
//

'use strict';

var path = require('path');
var express = require('express');

//============ Config files
var config = require('./config')(); // To be deprecated
const serverIp = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
const serverPort = process.env.OPENSHIFT_NODEJS_PORT || 8080;
const dbHost = process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost';
const dbPort = process.env.OPENSHIFT_MONGODB_DB_PORT || '27017';
const dbName = process.env.OPENSHIFT_
const dbUri = process.env.MONGOLAB_URI || 'mongodb://'+dbHost+':'+dbPort+'/llm-node';



//=======================================================
// Setup for passport auth
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

// configuration ========================================
mongoose.connect(config.mongodb.url, function connectionError(error){console.error(error);}); // connect to our database
mongoose.connection.on('error', function dbConnectionError(err, req, res, next){
  console.error(err);
  res.status(500).send(err.response || 'DB Connection Error!');
});

require('./modelos/passport')(passport); // pass passport for configuration

var app = express();

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'esteéumprogramaQUeestáUsandpeoSEcret' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


//==============================
// Resume normal app routines


app.disable('etag');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('trust proxy', true);
//app.configure('development', function () { app.locals.pretty = true; });


// Processos ================
var processosModelo = require('./processos/processosModelo')(config);
app.use('/processos', require('./processos/crud')(processosModelo));
app.use('/api/processos', require('./processos/api')(processosModelo));


// Categorias ================
var categoriasModelo = require('./categorias/model-mongodb')(config.mongodb.url, 'categorias');
app.use('/categorias', require('./categorias/crud')(categoriasModelo));
app.use('/api/categorias', require('./categorias/api')(categoriasModelo));

// Páginas estáticas ================
app.use(express.static('public'));


// routes ================================================
require('./routes.js')(app, passport);
// load our routes and pass in our app and fully configured passport


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
  var server = app.listen(serverPort, function () {
    var host = server.address().address;
    var port = server.address().serverPort;

    console.log('App listening at http://%s:%s', host, port);
  });
}

module.exports = app;
