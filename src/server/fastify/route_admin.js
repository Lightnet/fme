/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

//const jwt = require("jsonwebtoken");
//const user=require('../model/user');
const { isEmpty }=require('../model/utilities');
//const config = require('../../../config');

// HTML PAGE
function blankPage () {
  return '<html>' +
    `<head>
      <title>Admin</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://redom.js.org/redom.min.js"></script>
    </head>
    ` +
    '<body>' +
    '<script src="/client_admin.js"></script>' +
    '</body>' +
    '</html>'
}
// ROUTES
module.exports = function (fastify, opts, done) {
  // GET LOGIN
  fastify.get('/admin', function (request, reply) {
    reply.type('text/html');
    reply.send(blankPage());
  });

  fastify.post('/admin', async function (request, reply) {
    //reply.type('text/html');
    //const { content } = JSON.parse(request.body); //fetch
    const { content } = request.body;
    console.log(content);
    if(isEmpty(content)){
      reply.send({message:'empty!'});  
    }
    reply.send({message:'blank',content:content});
  });
  // FINISH
  done();
}