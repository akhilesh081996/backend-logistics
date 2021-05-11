'use strict';

const Hapi     = require('hapi');
const mongoose = require('mongoose');
// /const MongoDBUrl = 'mongodb://112.196.51.234:27017/logistics-hapi-api';
const MongoDBUrl = 'mongodb://localhost:27017/logistics-hapi-api';
const Vision = require('vision');
const hbs    = require('hbs');
const Inert  = require('inert');
const Path   = require('path');

const server = new Hapi.Server({
    port: 3000,
    host: 'localhost',
     // host: '0.0.0.0',
    routes: {
       cors:true
    }
});

var routes = require('./src/config/routes');

/* +_+_+_+_+_+_+_+_+_+_+ Plugins / Middlewares +_+_+_+_+_+_+_+_+_+_+ */

const middleware = require("./src/config/middleware");

(async() => {
    await server.register(Inert);
    await server.register(Vision);
	await server.register(middleware.auth.HAPI_AUTH_JWT);

	/* +_+_+_+_+_+_+_+_+_+_+_+_+_+_+ AUTH STRATEGIES +_+_+_+_+_+_+_+_+_+_+_+_+ */

	server.auth.strategy('AdminJWT','jwt', middleware.auth.AdminJWT); //strategy to validate AdminJWT tokens
	server.auth.strategy("AgencyJWT", "jwt", middleware.auth.AgencyJWT); //strategy to validate authJWT tokens
	server.route(routes);

    server.views({
        engines: {
            html: hbs
        },
        relativeTo: __dirname,
        path: 'views',
        //layout: true,
        layoutPath: 'views/layout',
        layout: 'layout',
        partialsPath: 'views/partials',
        helpersPath: 'views/helpers',
    });

    server.route({
        method: 'GET',
        path: '/{folder}/{param*}',
        handler: {
            directory: {
                path: Path.join(__dirname, 'public')
            }
        }
    })
  
    try {
        await server.start();
        // Once started, connect to Mongo through Mongoose
        mongoose.connect(MongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            console.log(`Connected to Mongo server`)
        }, err => { console.log(err) });
        console.log(`Server running at: ${server.info.uri}`);
    } catch (err) {
        console.log("This is the mongo error --",err)
    }
})();


// const Hapi = require('hapi')  
// const Handlebars = require('handlebars')

// // create new server instance
// const server = new Hapi.Server()


// async function liftOff() {  
//   await server.register({
//     plugin: require('vision')  // add template rendering support in hapi
//   })

//   // configure template support   
//   server.views({
//     engines: {
//       html: Handlebars
//     },
//     path: __dirname + '/views',
//     layout: 'layout'
//   })
// }

// liftOff()