'use strict';

var express = require('express');
var bodyParser = require('body-parser');

module.exports = function (model) {

  var router = express.Router();

  // Automatically parse request body as JSON
  router.use(bodyParser.json());

  /**
   * GET /api/books
   *
   * Retrieve a page of books (up to ten at a time).
   */
  router.get('/', function list(req, res, next) {
    model.list(10, req.query.pageToken, function (err, entities, cursor) {
      if (err) { return next(err); }
      res.json({
        items: entities,
        nextPageToken: cursor
      });
    });
  });

  /**
   * POST /api/books
   *
   * Create a new book.
   */
  router.post('/', function insert(req, res, next) {
    model.create(req.body, function (err, entity) {
      if (err) { return next(err); }
      res.json(entity);
    });
  });

  /**
   * GET /api/books/:id
   *
   * Retrieve a book.
   */
  router.get('/:processo', function get(req, res, next) {
    model.read(req.params.processo, function (err, entity) {
      if (err) { return next(err); }
      res.json(entity);
    });
  });

  /**
   * PUT /api/books/:id
   *
   * Update a book.
   */
  router.put('/:processo', function update(req, res, next) {
    model.update(req.params.processo, req.body, function (err, entity) {
      if (err) { return next(err); }
      res.json(entity);
    });
  });

  /**
   * DELETE /api/books/:id
   *
   * Delete a book.
   */
  router.delete('/:processo', function _delete(req, res, next) {
    model.delete(req.params.processo, function (err) {
      if (err) { return next(err); }
      res.status(200).send('OK');
    });
  });

  /**
   * Errors on "/api/books/*" routes.
   */
  router.use(function handleRpcError(err, req, res, next) {
    // Format error and forward to generic error handler for logging and
    // responding to the request
    err.response = {
      message: err.message,
      internalCode: err.code
    };
    next(err);
  });

  return router;
};
