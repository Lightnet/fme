/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

// Server Test
const fastify = require('fastify')({ 
  logger: false
  //, trustProxy: true
});

fastify.get('/', async (request, reply) => {
  reply.send({ hello: 'world' })
  //return { hello: 'world' }
});

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
        console.log(`>Fastify Server on %s`,address);
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
// SERVER INIT
start();