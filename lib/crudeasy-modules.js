// =====================
// # /crudeasy-modules.js
//

'use strict';

const loadCrudeasyModules = module.exports = function (config, app) {

//=========================
//  LOAD CRUDEASY MODULES

var crudEasy = require('crudeasy');
var isLoggedIn = function isLoggedIn(req, res, next) {
		// if user is authenticated in the session, carry on 
		if (req.isAuthenticated())
			return next();
		// if they aren't redirect them to the home page
		//res.render('login');
		res.redirect('/?redir='+encodeURIComponent(req.baseUrl));
	};

var isLoggedInJson = function isLoggedInJson (req, res, next) {
	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();
	// if they aren't return 401 http error
//    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
//    return res.sendStatus(401);
next();
	};

function loadJson(url,cb){
	require("request")({
		url: url,
		json: true
		},
		cb);
}

var loadCategorias = function(req, res, next){
/*	req.query.categorias = {};
	loadJson(req.protocol+'://'+req.hostname + ':'+config.port+'/api/categorias',function cb(error, response, body){
	    if (!error && response.statusCode === 200) {
	        console.log(body) // Print the json response
			for (var cats in body.items) {
				req.query.categorias[cats.tipo] += cats
				}
    		}
		loadJson(req.protocol+'://'+req.hostname +  ':'+config.port+'/api/clientes?perPage=1000',function cb(error, response, body){
		    if (!error && response.statusCode === 200) {
		        console.log(body) // Print the json response
				for (var clis in body.items) {
					req.query.categorias['clientes'] += clis
					}
	    		}
			loadJson(req.protocol+'://'+req.hostname +  ':'+config.port+'/api/pessoas?perPage=1000',function cb(error, response, body){
			    if (!error && response.statusCode === 200) {
			        console.log(body) // Print the json response
					for (var ppl in body.items) {
						req.query.categorias['pessoas'] += ppl
						}
		    		}*/
				next(); // only then call next middleware
				}/*);

			});
		});
	};*/
/*
var http = require("http");

var options = {
    host: 'www.google.com'
};

http.get(options, function (http_res) {
    // initialize the container for our data
    var data = "";

    // this event fires many times, each time collecting another piece of the response
    http_res.on("data", function (chunk) {
        // append this chunk to our growing `data` var
        data += chunk;
    });

    // this event fires *one* time, after all the `data` events/chunks have been gathered
    http_res.on("end", function () {
        // you can use res.send instead of console.log to output via express
        console.log(data);
    });
});

*/


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
    viewEdit:       "processos/form.jade"
	};
var instProcessos = crudEasy.newModel(config.mongodb.url, 'processos');
app.use('/processos', isLoggedIn, loadCategorias, crudEasy.crudRoute(instProcessos,configProcessos));
app.use('/api/processos', isLoggedInJson, crudEasy.apiRoute(instProcessos,configProcessos));

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
    viewEdit:       "pessoas/form.jade"
	};
var instPessoas = crudEasy.newModel(config.mongodb.url, 'pessoas');
app.use('/pessoas', isLoggedIn, crudEasy.crudRoute(instPessoas,configPessoas));
app.use('/api/pessoas', isLoggedInJson, crudEasy.apiRoute(instPessoas,configPessoas));

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
    viewEdit:       "clientes/form.jade"
	};
var instClientes = crudEasy.newModel(config.mongodb.url, 'clientes');
app.use('/clientes', isLoggedIn, crudEasy.crudRoute(instClientes,configClientes));
app.use('/api/clientes', isLoggedInJson, crudEasy.apiRoute(instClientes,configClientes));

// Usuários ================
var configUsuarios = {
    url: 			config.mongodb.url,
    collection:     "users",
    defaultPerPage: 10,
    routeNew:       "/novo",
    routeDelete:    "/:item/excluir",
    routeEdit:      "/:item/editar",
    labelNew:       "Novo",
    labelEdit:      "Editar",
    viewNew:        "users/form.jade", 
    viewItem:       "users/view.jade",
    viewList:       "users/list.jade",
    viewEdit:       "users/form.jade"
	};
var instUsers = crudEasy.newModel(config.mongodb.url, 'users');
app.use('/usuarios', isLoggedIn, crudEasy.crudRoute(instUsers, configUsuarios));
app.use('/api/usuarios', isLoggedInJson, crudEasy.apiRoute(instUsers, configUsuarios));


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
    viewEdit:       "categorias/form.jade"
	};
var instCategorias = crudEasy.newModel(config.mongodb.url, 'categorias');
app.use('/categorias', isLoggedIn, crudEasy.crudRoute(instCategorias,configCategorias));
app.use('/api/categorias', isLoggedInJson, crudEasy.apiRoute(instCategorias,configCategorias));



//  END
//===========================

};
