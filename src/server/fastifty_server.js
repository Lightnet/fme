/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

//===============================================
// SET UP

// https://github.com/fastify/fastify-jwt
// https://github.com/fastify/fastify-helmet
// https://github.com/fastify/fastify-cors

const path = require('path');
const fastifyCookie = require('fastify-cookie');
const fastifyCaching = require('fastify-caching');
const fastifyFormbody = require('fastify-formbody');
//const cookie = require("cookie");
//const jwt =require('jsonwebtoken');
const config=require('../../config');
//const helmet = require('fastify-helmet');
//const mobile = require('is-mobile');
//const SESSION_SECRET = 'a secret with minimum length of 32 characters';
//var SESSION_TTL = 864e3; // 1 day in seconds
//var db = require('./db');
// DATABASE
//console.log(db);
//db.init();
//===============================================
// Require the framework and instantiate it
console.log('Init Fastify Web Server Modules...')
const fastify = require('fastify')({ 
  //logger: true 
  logger: false
  //, trustProxy: true
});

//fastify.register(require('fastify-helmet'),
  // Example disables the `contentSecurityPolicy` middleware but keeps the rest.
  //{ contentSecurityPolicy: false }
//)
fastify.register(require('fastify-cors'), { 
  // put your options here
  //origin: "http://127.0.0.1:5984",
  //origin: "*",
  allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization'],
  methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE']
})
//===============================================
// dev tool
if(process.env.NODE_ENV !== 'production') fastify.register(require('fastify-error-page'));
fastify.get('/err', async function (req, reply) {
  throw new Error('Opppps!')
})
//===============================================
// BODY PRASE
fastify.register(fastifyFormbody);
fastify.register(fastifyCookie,{
  secret: "my-secret", // for cookies signature
  parseOptions: {}     // options for parsing cookies
});
fastify.register(fastifyCaching);
//===============================================
// STATIC PUBLIC FOLDER FILES
//console.log(path.join(__dirname, '../../public'));
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, '../../public')
  //,prefix: '/public/', // optional: default '/'
  ,prefix:'/'
});
//===============================================
// HTML templating
// point-of-view is a templating manager for fastify
fastify.register(require("point-of-view"), {
  engine: {
    handlebars: require("handlebars")
  }
});
//===============================================
// SOCKET.IO
// https://socket.io/docs/v3/server-api/index.html
fastify.register(require('fastify-socket.io'), {
  // put your options here
  //path: "/test",
  //serveClient: false,
  // below are engine.IO options
  //pingInterval: 10000,
  //pingTimeout: 5000,
  //cookie: false
})
//===============================================
// ROUTES
//===============================================
fastify.register(require('./fastify/routes'));
// SERVER PORT
var PORT = process.env.PORT || 3000;
PORT = config.port || process.env.PORT;
// LISTEN TRY CATCH
async function start(){
  // TRY RUN SERVER!
  try {
    // SERVER LISTEN 
    fastify.listen(
      {
        port:PORT
        ,host: '127.0.0.1' // localhost dev, closed network
        //,host: '0.0.0.0' // open to network
      }  
      , (err, address) => {
        if (err) {
          fastify.log.error(err);
          process.exit(1);
        }
        //console.log(address);
        //console.log(`>Fastify server running on http://localhost:${PORT}`);
        console.log(`>Fastify Server on %s`,address);
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
// SERVER INIT
start();
