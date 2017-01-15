'use strict';


// process.env.NODE_ENV = 'production';

var _ENV = process.env.NODE_ENV || 'development';


module.exports = {
    development: {
        mongo: {
        	MONGO_URI: "mongodb://localhost/blog_dev",
        	MONGO_OPTIONS: { db: { safe: true } }
    	},
    	amqp: {
    		AMQP_URI: "amqp://localhost",
    		AMQP_OPTIONS: null
    	},
    	redis: {
    		HOST: '127.0.0.1',
    		PORT: 6379,
    		REDIS_URI: "redis://192.168.0.102:6379",
    		REDIS_OPTIONS: null,
    		DB_NUMBERS: {
    			CINEMA_TICKET_NUMBER: 9 	// cinema ticket number
    		}
    	}
    },
    production: {
    	mongo: {
	        MONGO_URI: "mongodb://localhost/blog_prod",
	        MONGO_OPTIONS: { db: { safe: true } }
	    }
    },

}[_ENV];