// =====================
// # /main.js
//

'use strict';

var path = require('path');
var express = require('express');
var config = require('./config')();

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

require('./lib/passport')(passport); // pass passport for configuration

var app = express();

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'esteéumprogramaQUeestáUsandpeoSEcret15-4-2016' })); // session secret
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


//=========================
//  START

// Calls the Module 3 times, for routes and collections Movies and Actors.
var crudEasy = require('crudeasy');
var isLoggedIn = function isLoggedIn(req, res, next) {
		// if user is authenticated in the session, carry on 
		if (req.isAuthenticated())
			return next();
		// if they aren't redirect them to the home page
		//res.render('login');
		res.redirect('/?redir='+encodeURIComponent(req.baseUrl));
	};


//  END
//===========================

// Processos ================
var configProcessos = {
    url: config.mongodb.url,
    collection:     "processos",
    defaultPerPage: 10,
    routeNew:       "/novo",
    routeDelete:    "/:item/excluir",
    routeEdit:      "/:item/editar",
    labelNew:       "Novo",
    labelEdit:      "Editar",
    viewNew:        "processos/form.jade", 
    viewItem:       "processos/view.jade",
    viewList:       "processos/list.jade",
    viewEdit:       "processos/form.jade",
	middle:			isLoggedIn
	};
var instProcessos = crudEasy.newModel(config.mongodb.url, 'processos');
app.use('/processos', crudEasy.crudRoute(instProcessos,configProcessos));
app.use('/api/processos', crudEasy.apiRoute(instProcessos,configProcessos));

// Pessoas ================
var configPessoas = {
    url: 			config.mongodb.url,
    collection:     "pessoas",
    defaultPerPage: 10,
    routeNew:       "/novo",
    routeDelete:    "/:item/excluir",
    routeEdit:      "/:item/editar",
    labelNew:       "Novo",
    labelEdit:      "Editar",
    viewNew:        "pessoas/form.jade", 
    viewItem:       "pessoas/view.jade",
    viewList:       "pessoas/list.jade",
    viewEdit:       "pessoas/form.jade",
	middle:			isLoggedIn
	};
var instPessoas = crudEasy.newModel(config.mongodb.url, 'pessoas');
app.use('/pessoas', crudEasy.crudRoute(instPessoas,configPessoas));
app.use('/api/pessoas', crudEasy.apiRoute(instPessoas,configPessoas));

// Clientes ================
var configClientes = {
    url: 			config.mongodb.url,
    collection:     "clientes",
    defaultPerPage: 10,
    routeNew:       "/novo",
    routeDelete:    "/:item/excluir",
    routeEdit:      "/:item/editar",
    labelNew:       "Novo",
    labelEdit:      "Editar",
    viewNew:        "clientes/form.jade", 
    viewItem:       "clientes/view.jade",
    viewList:       "clientes/list.jade",
    viewEdit:       "clientes/form.jade",
	middle:			isLoggedIn
	};
var instClientes = crudEasy.newModel(config.mongodb.url, 'clientes');
app.use('/clientes', crudEasy.crudRoute(instPessoas,configClientes));
app.use('/api/clientes', crudEasy.apiRoute(instPessoas,configClientes));


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
  var server = app.listen(config.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
  });
}

module.exports = app;
