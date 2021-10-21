/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

// https://stackoverflow.com/questions/3350247/how-to-prevent-form-from-being-submitted
const user=require('../model/user');
const { isEmpty }=require('../model/utilities');

// ROUTES
module.exports = function (fastify, opts, done) {
  // GET FORGOT
  fastify.get('/forgot', function (request, reply) {
    reply.type('text/html');
    //reply.send(forgotPage());
    let user={
      hello:"world param"
    }
    let params = request.query.raw ? {} : { user: user };
    params.title='Forgot';
    params.jscript='client_gethint.js';
    return reply.view("./src/server/fastify/views/base.hbs", params);

  });
  // https://stackoverflow.com/questions/64817562/giving-error-with-node-fastify-unsupported-media-type-application-x-www-form-ur
  // https://www.w3schools.com/js/js_json_parse.asp
  // POST FORGOT 
  fastify.post('/forgot',async function (request, reply) {
    console.log("get hint");
    //console.log(request.body);
    const { alias, question1, question2} = JSON.parse(request.body);
    //console.log("alias:",alias);
    //console.log("question1:",question1);
    //console.log("question2:",question2);

    if(isEmpty(alias)==true || isEmpty(question1)==true || isEmpty(question2)==true){
      console.log("Empty!");
      return reply.send({error:"Empty!"});
    }

    let checkhint = await user.aliasForgotGetHintSync({alias:alias,question1:question1,question2:question2});
    console.log('checkhint:',checkhint);
    if(checkhint){
      if(checkhint=='FAIL'){
        reply.send({message:'FAIL'});
      }else{
        reply.send({message:'FOUND',hint:checkhint});
      }
    }else{
      reply.send({message:'NOTFOUND'});
    }
    //reply.send({message:"POST FORGOT"});
  });
  //FINISH
  done();
}