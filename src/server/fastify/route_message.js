/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

// HTML PAGE
function messagePage() {
  return '<html>' +
  `<head>
    <title>Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://redom.js.org/redom.min.js"></script>
  </head>
  ` +
  '<body>' +
  '<script src="/client_message.js"></script>' +
  '</body>' +
'</html>';
}

// ROUTE
module.exports = function (fastify, opts, done) {
  fastify.get('/message', function (request, reply) {
    reply.type('text/html');
    reply.send(messagePage());
  });

  //fastify.post('/message', async function (request, reply) {
    //reply.type('text/html');
    //const { alias, passphrase } = request.body;
  //});

  // FINISH
  done();
};