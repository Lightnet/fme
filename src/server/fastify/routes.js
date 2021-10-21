/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

const user=require('../model/user');

const jwt = require("jsonwebtoken");
const config =require('../../../config');
//const SEA = require('gun/sea');

//CHECK FOR URL MATCH FOR WHITELIST
function checkUrl(value,arr){
  let status = false;
  for(let i=0; i<arr.length; i++){
    let name = arr[i];
    if(name == value){
      status = true;
      break;
    }
  }
  return status;
}

function DateToTime(){
  //return new Date().toString();
  //return new Date().toUTCString();
  return new Date().getTime();
}

// whitelist for access for user account login and logout
let urllist=[
  //'/'
   '/login'
  , '/signup'
  , '/forgot'
  , '/logout'
  , '/client_access.js'
  //, '/termofservice'
  //, '/about'
  , '/favicon.ico'
];

// ROUTES
async function routes (fastify, options, done) {
  //fastify.get('/', async (request, reply) => {
    //return { hello: 'world' }
  //});
  
  //fastify.register(require('fastify-favicon'))
  fastify.get('/favicon.ico', function (request, reply) {
    //console.log("No Favicon!");
    reply.code(204); // 204 No Content
  });

  //when the server is ready and do something here...
  fastify.ready(err => {
    if (err) throw err
    //console.log('SERVER READY!');
    //console.log('INIT SOCKET.IO');
    fastify.io.on('connect', (socket) =>{
      //console.log(socket);
      //const cookies = cookie.parse(socket.request.headers.cookie || "");
      try{
        //let token = cookies.token;
        //console.log('token:',token.split('.').length); // must be 3 for jwt to work
        //console.log('token',token);
        let cookies = fastify.parseCookie(socket.request.headers.cookie);
        let bCookie = fastify.unsignCookie(cookies.token);
        //console.log(bCookie);
        let data = jwt.verify(bCookie.value, config.tokenKey);
        //console.log(data);
        console.log('PASS ALIAS');
        //socket.emit('alias',{alias:data.alias});
        socket.alias = data.alias;
      }catch(err){
        console.log('FAIL ALIAS');
      }
      
      //socket.send('hello!');
      socket.on('test',(data)=>{
        console.log('data',data);
        console.log(socket.alias);
      });

      socket.on('chatmessage',(data)=>{
        console.log('data |> :',data);
        socket.emit('chatmessage',{
          alias:socket.alias
          , msg:data
          , date:DateToTime()
        });
        /*
        socket.local.emit('chatmessage',{
          alias:socket.alias
          , msg:data
          , date:DateToTime()
        });
        */
        //socket.local.emit('chatmessage',data);
      });
      //console.info('Socket connected!', socket.id);
    });
  });

  // Request/Response validation and hooks
  fastify.addHook('preHandler', async (request, reply) => {
    //console.log('URL:',request.url);
    //req.log.info({ url: req.raw.url, id: req.id }, 'received request');
    //console.log('isMobile?:',
      //mobile({ ua: req })
    //);
    //console.log("IP:",request.ip);
    //console.log("IPS:",request.ips);
    //console.log("IP:",request.ip);
    //console.log("ipRemote:",request.raw.connection.remoteAddress);

    let bCookie;
    let token = request.cookies.token;
    //console.log('[ TOKEN ACCESS AUTH CHECKS]');
    if(token){
      //console.log('[ FOUND TOKEN ]');
      bCookie = request.unsignCookie(request.cookies.token);
    }else{
      console.log('[ NULL TOKEN ]');
    }
    //console.log(token);
    //console.log(bCookie);
    
    //CHECK WHITELIST URL
    //Check if user token does not exist to return
    if(request.url == '/' && token == null){
      return;
    }
    // Do not add "/" else it will no detect valid token key
    if(checkUrl(request.url, urllist) == true){
      return;
    }
    //Check if there no token to not allow user access other urls.
    if(!token){//401
      //throw new Error('Unauthorized Access!');
      return reply.code( 401 ).send('Unauthorized Access!');
    }
    
    try{
      //let ptoken = parseJwt(bCookie.value);
      //console.log("ptoken:",ptoken);

      // check parse valid data
      let data = jwt.verify(bCookie.value, config.tokenKey);
      // set data
      //console.log(data);
      request.alias=data.alias;
      request.accesskey=data.accesskey;
      let sea = await user.aliasVerifyToken(bCookie.value);
      //console.log(sea);
      if(sea){
        request.sea = sea;
      }else{
        console.log("ERROR TOKEN SEA ERROR!")
      }
      
    }catch(e){
      console.log('[ No Token! || Invalid Token! ]');
      //check if the token key outdate to clear it to match
      user.aliasVerifyToken(bCookie.value);
      //clear cookie token if not valid
      reply.clearCookie('token',{signed: true});
      console.log(e);
      reply.redirect(302,'/');
      //reply.code( 401 ).send();
    }
  });
  //ERROR
  fastify.addHook('onError', async (request, reply, error) => {
    console.log("ERROR!");
    reply.send('Unauthorized Access!');
    // Useful for custom error logging
    // You should not use this hook to update the error
  })

  // GET INDEX PAGE
  fastify.get('/', async function (request, reply) {
    reply.code(200);
    reply.header('Content-Type', 'text/html');

    let user={
      hello:"world param"
    }
    let params = request.query.raw ? {} : { user: user };
    //console.log(params);
    console.log(`Hello, ${request.alias}!`);
    //let bCookie;
    let token = request.cookies.token;
    //if(token){
      //make sure the token time is valid.
      //bCookie = request.unsignCookie(request.cookies.token);
      //console.log(bCookie);
    //}
    //console.log(token);
    if(token){
      params.jscript='client_index.js';
      return reply.view("./src/server/fastify/views/index.hbs", params);
    }else{
      params.jscript='client_access.js';
      return reply.view("./src/server/fastify/views/index.hbs", params);
    }
  });
  //TEST
  fastify.get('/test', async function (request, reply) {
    //reply.code(200);
    reply.type('text/html');
    reply.send(`<html><body>[ Test ] <a href="/">Home</a></body></html>`);
  });

  //ROUTES
  fastify.register(require('./route_login')); // works
  fastify.register(require('./route_logout')); // works
  fastify.register(require('./route_signup')); // 
  fastify.register(require('./route_forgot')); // 
  fastify.register(require('./route_account')); //  
  fastify.register(require('./route_chat')); // 
  fastify.register(require('./route_message')); // 
  //fastify.register(require('./route_mod')); // 
  fastify.register(require('./route_admin')); // 
  //fastify.register(require('./route_ticket')); // 
  // FINISH
  done();
}
module.exports = routes;