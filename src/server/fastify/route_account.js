/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

const jwt = require("jsonwebtoken");
const user=require('../model/user');
const { isEmpty }=require('../model/utilities');
const config = require('../../../config');
const SEA = require('gun/sea');

const { processAccessToken } =require('./helper');

// ROUTES
module.exports = function (fastify, opts, done) {
  // GET LOGIN
  fastify.get('/account', function (request, reply) {
    reply.type('text/html');
    //reply.send(accountPage());
    let user={
      hello:"world param"
    }
    let params = request.query.raw ? {} : { user: user };
    params.title='Account';
    params.jscript='client_account.js';
    return reply.view("./src/server/fastify/views/index.hbs", params);
  });

  fastify.get('/account/pubkey', async function (request, reply) {
    //reply.type('text/html');
    let data = await processAccessToken(request, reply);
    console.log(data);
    if(data){
      reply.send({publickey:data.sea.pub});
    }else{
      reply.send({error:'TOKEN INVALID'});
    }
  });

  fastify.post('/sethint', async function (request, reply) {
    //reply.type('text/html');
    const { question1, question2, hint } = JSON.parse(request.body);
    //reply.send('data');
    //console.log('SET HINT');
    //console.log('question1: ',question1);
    //console.log('question2: ',question2);
    //console.log('hint: ',hint);

    if(isEmpty(question1)==true || isEmpty(question2)==true || isEmpty(hint)==true){
      return reply.send({message:'Empty question1 || question2 || hint'});
    }

    //check on preHandler from route
    let alias = request.alias;
    let sea = request.sea;
    //console.log("alias:", alias);
    //console.log("sea:", sea);
    if(alias==null || sea==null){
      return reply.send({message:'NOT FOUND ALIAS || SEA'});
    }

    let chceckhint = await user.aliasSetQuestionsHintSync({alias:alias,question1:question1,question2:question2,hint:hint,sea:sea});
    if(chceckhint){
      //console.log('FOUND');
      return reply.send({message:'FOUND',hint:chceckhint});
    }else{
      //console.log('NOTFOUND');
      return reply.send({message:'NOTFOUND'});
    }
  });

  fastify.post('/gethint', async function (request, reply) {

    //check on preHandler from route
    let alias = request.alias;
    let sea = request.sea;
    //console.log("alias:", alias);
    //console.log("sea:", sea);
    if(alias==null || sea==null){
      return reply.send({message:'NOT FOUND ALIAS || SEA'});
    }

    let chceckhint = await user.getAliasQuestionsHintSync({alias:alias,sea:sea});
    if(chceckhint){
      //console.log('FOUND');
      reply.send({message:'FOUND',data:chceckhint});
    }else{
      //console.log('NOTFOUND');
      reply.send({message:'NOTFOUND'});
    }
  });

  fastify.post('/changepassphrase', async function (request, reply) {
    const { oldpassphrase, newpassphrase } = JSON.parse(request.body);
    //console.log('oldpassphrase',oldpassphrase);
    //console.log('newpassphrase',newpassphrase);

    //check on preHandler from route
    let alias = request.alias;
    let sea = request.sea;
    //console.log("alias:", alias);
    //console.log("sea:", sea);
    if(alias==null || sea==null){
      return reply.send({message:'NOT FOUND ALIAS || SEA'});
    }

    let isPassphraseChange = await user.aliasChangePassphraseSync({
      alias:alias,
      oldpassphrase:oldpassphrase,
      newpassphrase:newpassphrase,
      sea:sea
    });
    console.log('isPassphraseChange:',isPassphraseChange);
    reply.send({isPassphraseChange:isPassphraseChange});
  });
  // FINISH
  done();
}