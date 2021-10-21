/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

// https://stackoverflow.com/questions/5869216/how-to-store-node-js-deployment-settings-configuration-files
var config={
  host:"localhost"
  ,port:3000
  // key for user
  ,saltKey: '0123456789'
  ,saltRounds: 10
  // jwt.sign
  ,tokenKey:'token'
  ,sessionId:'sessionId'
  ,secretKey:'a secret with minimum length of 32 characters'
  ,session_TTL:1800000
  //COOKIE
  ,cookieId:'sessionid'
  ,cookieKey:'cookieKey'
  ,isEmail:false
  ,email:{
    login:'user'
    ,pass:'pass'
    ,host:'localhost'
    ,port:507
  }
  , databasetype:'mongoose' //
  , databaseurl:''

};
//exports=config;
module.exports = config;