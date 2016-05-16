// =====================
// # /main.js
//

'use strict';

var path         = require('path'),
    express      = require('express'),
    config       = require('./config')(),
    mongoose     = require('mongoose'),
    passport     = require('passport'),
    flash        = require('connect-flash'),
    morgan       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    session      = require('express-session'),
    MongoStore   = require('connect-mongo')(session);

//    MongoDBStore = require('connect-mongodb-session')(session);


console.log("\nPorta: %s\nURL: %s\n", config.port, config.mongodb.url);

// configuration ========================================
mongoose.connect(config.mongodb.url, function connectionError(error){console.error(error);});
mongoose.connection.on('error', function dbConnectionError(err, req, res, next){
  console.error(err);
  res.status(500).send(err.response || 'DB Connection Error!');
});

require('./lib/passport')(passport); // pass passport for configuration

var app = express();

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: false})); // get information from html forms

// app.set('view engine', 'ejs'); // set up ejs for templating

// Session on Mongodb

/*
var whereToStoreSessions = new MongoDBStore({ 
      uri: config.mongodb.url,
      collection: 'sessions'
      },
      function(error) {
	    console.error(error);
      });
 
    // Catch errors 
    whereToStoreSessions.on('error', function(error) {
//      assert.ifError(error);
//      assert.ok(false);
    console.error(error);
    });
*/
/*
    app.use(require('express-session')({
      secret: 'esteéumprogramaQUeestáUsandpeoSEcret20160503',
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week 
      },
      saveUninitialized: true,
      resave: true,
      store: whereToStoreSessions
    }));
*/

app.use(session({
    secret: 'esteéumprogramaQUeestáUsandpeoSEcret20160503',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week 
    },
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));



// required for passport
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
app.use('/clientes', crudEasy.crudRoute(instClientes,configClientes));
app.use('/api/clientes', crudEasy.apiRoute(instClientes,configClientes));


// Categorias ================
var configCategorias = {
    url: 			config.mongodb.url,
    collection:     "categorias",
    defaultPerPage: 1000,
    routeNew:       "/novo",
    routeDelete:    "/:item/excluir",
    routeEdit:      "/:item/editar",
    labelNew:       "Nova",
    labelEdit:      "Editar",
    viewNew:        "categorias/form.jade", 
    viewItem:       "categorias/view.jade",
    viewList:       "categorias/list.jade",
    viewEdit:       "categorias/form.jade",
	middle:			isLoggedIn
	};
var instCategorias = crudEasy.newModel(config.mongodb.url, 'categorias');
app.use('/categorias', crudEasy.crudRoute(instCategorias,configCategorias));
app.use('/api/categorias', crudEasy.apiRoute(instCategorias,configCategorias));

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
