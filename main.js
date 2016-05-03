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
    MongoDBStore = require('connect-mongodb-session')(session);


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
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: false})); // get information from html forms

// app.set('view engine', 'ejs'); // set up ejs for templating

// Session on Mongodb

var store = new MongoDBStore({ 
      uri: config.mongodb.url,
      collection: 'sessions'
      });
 
    // Catch errors 
    store.on('error', function(error) {
//      assert.ifError(error);
//      assert.ok(false);
    });
 
    app.use(require('express-session')({
      secret: 'esteéumprogramaQUeestáUsandpeoSEcret20160503',
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week 
      },
      saveUninitialized: true;
      store: store
    }));


// DEPRECATED AND SHOULDN'T BE USED IN PRODUCTION:
//app.use(session({ secret: 'esteéumprogramaQUeestáUsandpeoSEcret' })); // session secret

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
  var server = app.listen(config.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
  });
}

module.exports = app;
