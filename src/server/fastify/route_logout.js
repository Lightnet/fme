/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

const user=require('../model/user');

module.exports = function (fastify, opts, done) {
  fastify.get('/logout', async function (request, reply) {
    reply.code(200);
    reply.type('text/html');
    //CHECK IF TOKEN IS NULL OR STRING
    //console.log("request.cookies");
    //console.log(request.cookies);
    let token=request.cookies.token;
    //console.log('token:',token);
    if(token){
      //console.log("[ROUTE TOKEN LOGOUT!!]");
      //let data = jwt.verify(token, config.tokenKey);
      //console.log(data);
      //make sure cookie expire need to check that later.
      let bCookie = request.unsignCookie(request.cookies.token);
      //console.log(">>>bCookie");
      //console.log(bCookie);
      //console.log(">>>bCookie.value");
      //console.log(bCookie.value);
      //token = bCookie.value;
      //try{
        let islogout = await user.aliasLogoutSync(bCookie.value);
        console.log('islogout:',islogout);
      //}catch(e){
        //console.log('ERROR!');
        //console.log(e);
      //}

      reply.clearCookie('token',{
        signed: true
      });
      //reply.redirect(302,'/');
      reply.send(`<html><body>[ Logout ] <a href="/">Home</a></body></html>`);
      return
    }else{
      console.log('FAIL TOKEN');
      reply.clearCookie('token',{
        signed: true
      });
      //reply.redirect('/');
      //reply.redirect(302,'/');
      reply.send(`<html><body>[ FAIL ] <a href="/">Home</a></body></html>`);
    }
    //reply.send(`<html><body>[ LOGOUT ] <a href="/">Home</a></body></html>`);
  });
  // FINISH
  done();
}