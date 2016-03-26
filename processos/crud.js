'use strict';

var express = require('express');
var bodyParser = require('body-parser');

module.exports = function (model) {

	var router = express.Router();

	// Automatically parse request body as form data
	router.use(bodyParser.urlencoded({ extended: false }));

	// Set Content-Type for all responses for these routes
	router.use(function (req, res, next){
		res.set('Content-Type', 'text/html');
		next();
	});
  
	router.use(function isLoggedIn(req, res, next) {

		// if user is authenticated in the session, carry on 
		if (req.isAuthenticated())
			return next();

		// if they aren't redirect them to the home page
		res.render('login');
	});

  /**
   * GET /processos/
   *
   * Mostrar a página que lista todos os processos.
   */
  router.get('/', function list(req, res, next) {
      var perPage = 10;
      if (req.query.perPage!=null){          
          console.log("perPage definido como " + req.query.perPage);
          perPage = req.query.perPage;
      } else {console.log("perPage não definido. Retornando padrão '10'");}
      model.list(parseInt(perPage), req.query.pageToken, function (err, entities, cursor) {
      if (err) { return next(err); }
      res.render('processos/list.jade', {
        processos: entities,
        perPage: perPage,
        nextPageToken: cursor
      });
    });
  });

  /**
   * GET /procesos/novo
   *
   * Apresentar formulário para adicionar novo processo.
   */
  // [START novo]
  router.get('/novo', function addForm(req, res) {
    res.render('processos/form.jade', {
      processo: {},
      action: 'Novo',
      categorias: require('./classesProcessuais')

    });
  });
  // [END add_get]
  /**
   * POST /books/add
   *
   * Create a book.
   */
  // [START add_post]
  router.post('/novo', function insert(req, res, next) {
    var data = req.body;

    // Save the data to the database.
    model.create(data, function (err, savedData) {
      if (err) { return next(err); }
      res.redirect(req.baseUrl + '/' + savedData.id);
    });
  });
  // [END add_post]

  /**
   * GET /processos/:id/editar
   *
   * Mostra um processo para editar.
   */
  router.get('/:processo/editar', function editForm(req, res, next) {
    model.read(req.params.processo, function (err, entity) {
      if (err) { return next(err); }
      res.render('processos/form.jade', {
        processo: entity,
        action: 'Editar',
        categorias: require('./classesProcessuais')
      });
    });
  });

  /**
   * POST /processos/:id/editar
   *
   * Atualiza um processo.
   */
  router.post('/:processo/editar', function update(req, res, next) {
    var data = req.body;

    model.update(req.params.processo, data, function (err, savedData) {
      if (err) { return next(err); }
      res.redirect(req.baseUrl + '/' + savedData.id);
    });
  });

  /**
   * GET /processos/:id
   *
   * Mostra um processo.
   */
  router.get('/:processo', function get(req, res, next) {
    model.read(req.params.processo, function (err, entity) {
      if (err) { return next(err); }
      res.render('processos/view.jade', {
        processo: entity
      });
    });
  });

  /**
   * GET /procesos/:id/excluir
   *
   * Exclui um processo.
   */
  router.get('/:processo/excluir', function _delete(req, res, next) {
    model.delete(req.params.processo, function (err) {
      if (err) { return next(err); }
      res.redirect(req.baseUrl);
    });
  });

  /**
   * Errors on "/processos/*" routes.
   */
  router.use(function handleRpcError(err, req, res, next) {
    // Format error and forward to generic error handler for logging and
    // responding to the request
    err.response = err.message;
    next(err);
  });

  return router;
};
