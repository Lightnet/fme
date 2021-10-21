/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

const jwt = require("jsonwebtoken");
const config = require('../../../config');
const SEA = require('gun/sea');

async function processAccessToken(request,reply){
  let bCookie;
  let token = request.cookies.token;
  let data=null;
  if(token){
    //console.log('[ FOUND TOKEN ]');
    bCookie = request.unsignCookie(request.cookies.token);
  }else{
    console.log('[ NULL TOKEN ]');
    //return reply.code( 401 ).send();
    return null;
  }
  //console.log(bCookie.value);
  try{
    data = jwt.verify(bCookie.value, config.tokenKey);
    //console.log(data);
    //console.log(SEA);
    let saltkey = await SEA.work(data.key, data.alias);
    let sea = await SEA.decrypt(data.sea, saltkey);
    data.sea = sea;
    //console.log(sea);
  }catch(e){
    console.log('[ No Token! || Invalid Token! ]');
    //console.log(e);
    reply.clearCookie('token',{signed: true});
    //reply.code( 401 ).send();
    return null;
  }
  
  return data;
}
module.exports.processAccessToken=processAccessToken;