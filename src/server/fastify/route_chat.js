/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

// ROUTE
module.exports = function (fastify, opts, done) {
  fastify.get('/chat', function (request, reply) {
    reply.type('text/html');
    //reply.send(chatPage());

    let user={
      hello:"world param"
    }
    let params = request.query.raw ? {} : { user: user };
    params.title='Chat';
    params.jscript='client_chat.js';
    return reply.view("./src/server/fastify/views/chat.hbs", params);

  });

  //fastify.post('/chat', async function (request, reply) {
    //reply.type('text/html');
    //const { alias, passphrase } = request.body;

  //});
  // FINISH
  done();
};