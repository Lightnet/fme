/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

const user=require('../model/user');
var { isEmpty }=require('../model/utilities');
//const jwt = require("jsonwebtoken");
//const config =require('../../../config');
//const SEA = require('gun/sea');

// ROUTES
module.exports = function (fastify, opts, done) {
  // GET LOGIN
  fastify.get('/login', function (request, reply) {
    reply.type('text/html');
    //reply.send(loginPage());

    let data={
      hello:"world param"
    }
    let params = request.query.raw ? {} : data ;
    params.title='Login';
    params.jscript='client_login.js';
    return reply.view("./src/server/fastify/views/index.hbs", params);

  });
  // POST LOGIN
  fastify.post('/login', async function (request, reply) {
    reply.type('text/html');
    const { alias, passphrase } = request.body;
    //console.log("alias:",alias);
    //console.log("passphrase:",passphrase);
    if(isEmpty(alias)==true || isEmpty(passphrase)==true){
      reply.send('Empty Alias || passphrase');
      return;
    }
    //CHECK LOGIN ID and PASSPHRASE
    let data = await user.loginAliasSync({
      alias:alias
      ,passphrase:passphrase
    });
    //console.log('END loginAliasSync');
    //console.log(data);
    if(data){
      reply.setCookie('token', data, {
        //domain: 'localhost'
        //, path: '/',
        httpOnly: true //client browser document.cookie
        , signed: true
      });
      reply.redirect('/');
      //reply.send(`<html><body> LOGIN [ Pass ] <a href='/'>Home</a></body></html>`);
    }else{
      reply.send(`<html><body> LOGIN [ Fail ] <a href='/'>Home</a></body></html>`);
    }
  });
  // FINISH
  done();
}