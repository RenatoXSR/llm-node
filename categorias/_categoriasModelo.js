'use strict';

var models = {
/*  cloudsql: require('./model-cloudsql'),
  datastore: require('./model-datastore'),*/
  mongodb: require('./model-mongodb')
};

module.exports = function(config) {
        return models[config.dataBackend](config);
};
