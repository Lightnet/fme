/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

// HTML PAGE
function forumPage () {
  return '<html>' +
  `<head>
    <title>Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://redom.js.org/redom.min.js"></script>
    <script src="/socket.io/socket.io.js"></script>

  </head>
  ` +
  '<body>' +
  '<script src="/client_chat.js"></script>' +
  '</body>' +
'</html>';
}

// ROUTE
module.exports = function (fastify, opts, done) {
  fastify.get('/forum', function (request, reply) {
    reply.type('text/html');
    reply.send(forumPage());
  });

  //fastify.post('/chat', async function (request, reply) {
    //reply.type('text/html');
    //const { alias, passphrase } = request.body;

  //});
  // FINISH
  done();
};