'use strict';

var getConfig = module.exports = function () {
  return {
    port: process.env.PORT || 8080,

    // dataBackend can be 'datastore', 'cloudsql', or 'mongodb'. Be sure to
    // configure the appropriate settings for each storage engine below.
    // If you are unsure, use datastore as it requires no additional
    // configuration.
    dataBackend: process.env.BACKEND || 'mongodb',

    // This is the id of your project in the Google Developers Console.
    gcloud: {
      projectId: process.env.GCLOUD_PROJECT || 'llm-silvrosa'
    },

    mysql: {
      user: process.env.MYSQL_USER || 'your-mysql-user',
      password: process.env.MYSQL_PASSWORD || 'your-mysql-password',
      host: process.env.MYSQL_HOST || 'your-mysql-host'
    },

    mongodb: {
      url: process.env.MONGO_URL || 'mongodb://llm-master-proto-silvrosa:Renato2016-@ds011419.mlab.com:11419/llm-master-proto',
      collection: process.env.MONGO_COLLECTION || 'processos'
    },
	
	facebookAuth : {
        'clientID'      : '473538719498517', // your App ID
        'clientSecret'  : '17bfdf03ca1e3c36793f524816c2906e', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    twitterAuth : {
        'consumerKey'       : 'YZFLHJsoltXvs8neW8k5NEAJ5',
        'consumerSecret'    : 'zELTGA9IU6l7CdHWulzu8k4RT0b3iQvfmORAwHaX96OZ21vMpp',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    googleAuth : {
        'clientID'      : '882591859135-b6b8j81fs4ads8rg5d1nc39kucd3gelg.apps.googleusercontent.com',
        'clientSecret'  : 'MUDEWhSYWsf8r9IOQF3lI2Vo',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    },
	
	linkedinAuth : {
        'consumerKey'    : '77o3zo7okkz90j',
        'consumerSecret' : '2TewsHdtFLGj2tP9',
        'callbackURL'    : 'http://localhost:8080/auth/linkedin/callback'
    }
  };
};

var config = getConfig();
