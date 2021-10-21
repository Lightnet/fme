/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

//const jwt = require("jsonwebtoken");
//const user=require('../model/user');
//const { isEmpty }=require('../model/utilities');
//const config = require('../../../config');

// HTML PAGE
function blankPage () {
  return '<html>' +
    `<head>
      <title>blank</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://redom.js.org/redom.min.js"></script>
    </head>
    ` +
    '<body>' +
    '<script src="/client_ticket.js"></script>' +
    '</body>' +
    '</html>'
}
// ROUTES
module.exports = function (fastify, opts, done) {
  // GET LOGIN
  fastify.get('/ticket', function (request, reply) {
    reply.type('text/html');
    reply.send(blankPage());
  });

  fastify.post('/ticket', async function (request, reply) {
    //reply.type('text/html');
    //const { aliasid, content, hint } = JSON.parse(request.body);
    //reply.send('data');
    //if(isEmpty(question1)==true || isEmpty(question2)==true || isEmpty(hint)==true){
      //reply.send({message:'Empty question1 || question2 || hint'});
      //return;
    //}
    //let token = request.session.token;
    //let data = jwt.verify(token, config.tokenKey);
    //if(!data){
      //reply.send({message:'NOT FOUND ALIAS!'});
    //}
    //console.log(data);
    //let alias = data.alias;
    reply.send({message:'ticket'});
  });
  // FINISH
  done();
}