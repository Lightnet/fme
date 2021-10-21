/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

// https://developer.okta.com/blog/2018/11/13/create-and-verify-jwts-with-node
// https://www.sohamkamani.com/blog/javascript/2019-03-29-node-jwt-authentication/
// https://www.npmjs.com/package/jsonwebtoken
// https://github.com/sohamkamani/jwt-nodejs-example

//const jwt = require("jsonwebtoken");
//const bcrypt=require('bcrypt');
const db=require('../db');
//const config=require('../../../config');
//const SEA = require('gun/sea');
//const {create32Key} =require('./utilities');
//const jwtKey = "my_secret_key";
//console.log('user init db?');
//const jwtExpirySeconds = 300;
//===============================================
// CHECK ALIAS ID
//===============================================
// let isExist = await user.checkAliasExistSync('testalias');
function checkAliasExistSync(alias){
  return new Promise(resolve => {
    db.checkAliasId(alias,function(error,data){
      if(error){
        resolve(error);
      }
      if(data){ 
        if(data.message=='FOUND'){
          resolve(true);
        }else{
          resolve(false);
        }
      }
    });
  });
}
exports.checkAliasExistSync = checkAliasExistSync;
//===============================================
// CREATE ALIAS
//===============================================
function createAliasSync(data){
  return new Promise(resolve => {
    db.createAliasId(data,function(error, data2){
      if(error){
        return resolve(error);
      }
      console.log(data2);
      if(data2){
        if(data2.message=='CREATED'){
          resolve('CREATED');
        }else if(data2.message){
          resolve('EXIST');
        }else{
          resolve('ERROR');
          //resolve(null);
        }
      }else{
        resolve('NULL ARGS ERROR');
        //resolve(null);
      }
      console.log('END createAliasSync');
      //resolve(null);
    });
  });
}
exports.createAliasSync = createAliasSync;
//===============================================
// LOGIN ALIAS
//===============================================
// https://stackoverflow.com/questions/45207104/how-to-set-jwt-token-expiry-time-to-maximum-in-nodejs
// https://www.npmjs.com/package/jsonwebtoken
// Backdate a jwt 30 seconds
// iat: Math.floor(Date.now() / 1000) - 30
// Signing a token with 1 hour of expiration:
// exp: Math.floor(Date.now() / 1000) + (60 * 60),
//  
function loginAliasSync(data){
  return new Promise(resolve => {
    //console.log("PM LOGIN");
    //console.log(db);
    db.aliasCheckLogin(data,(data2)=>{
      return resolve(data2);
    });
  });
}
exports.loginAliasSync = loginAliasSync;
//===============================================
// ALIAS SET QUESTIONS & HINT
//===============================================
function aliasSetQuestionsHintSync(data){
  return new Promise(resolve => {
    db.aliasSetQuestionsHint(data,(ack)=>{
      resolve(ack);
    })
  });
}
exports.aliasSetQuestionsHintSync = aliasSetQuestionsHintSync;
//===============================================
// ALIAS FORGOT GET HINT
//===============================================
function aliasForgotGetHintSync(data){
  return new Promise(resolve => {
    db.getAliasHint(data,async (ack)=>{
      if(ack){
        if(ack=='FAIL'){
          resolve(null);
        }else{
          resolve(ack);
          //resolve(ack);
        }
      }else{
        resolve(null);
      }
    });
  });
}
exports.aliasForgotGetHintSync = aliasForgotGetHintSync;
//===============================================
// ALIAS GET HINT
//===============================================
function getAliasQuestionsHintSync(data){
  return new Promise(resolve => {
    db.getAliasQuestionsHint(data,async (ack)=>{
      if(ack){
        if(ack=='FAIL'){
          resolve(null);
        }else{
          resolve(ack);
        }
      }else{
        resolve(null);
      }
    });
  });
}
exports.getAliasQuestionsHintSync = getAliasQuestionsHintSync;
//===============================================
// CHANGE PASSPHRASE
//===============================================
function aliasChangePassphraseSync(data){
  return new Promise(async (resolve) => {
    //TODOLIST
    db.aliasChangePassphrase(data,(ack)=>{
      resolve(ack);
    });
  });
}
exports.aliasChangePassphraseSync = aliasChangePassphraseSync;
//===============================================
// LOGOUT
//===============================================
// NEEDED? DB clear token, cookie, session?
function aliasLogoutSync(data){
  return new Promise(async (resolve) => {
    if(data){
      db.aliasLogout(data,(ack)=>{
        //console.log('alias logout ack',ack);
        if(ack=='PASS'){
          //console.log("DONE LOGOUT!");
          resolve(true);
        }else{
          resolve(false);
        }
      });
    }else{
      //console.log('ERROR! NULL DATA!');
      resolve(false);
    }
  });
}
exports.aliasLogoutSync = aliasLogoutSync;

function aliasVerifyToken(data){
  return new Promise(async (resolve) => {
    db.aliasVerifyToken(data,ack=>{
      resolve(ack);
    });
  });
}
exports.aliasVerifyToken = aliasVerifyToken;

//===============================================
// TMP SET UP
//===============================================
//function createAliasSync(data){
  //return new Promise(resolve => {
    //resolve(null);
  //});
//}
//exports.createAliasSync = createAliasSync;
//===============================================
// TMP SET UP
//===============================================