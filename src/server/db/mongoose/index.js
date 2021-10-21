/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

console.log("Mongoose INIT...");
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');
const config=require('../../../../config');

const mongoose = require('mongoose');

// https://mongoosejs.com/docs/
// https://mongoosejs.com/docs/connections.html
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
// https://www.section.io/engineering-education/nodejs-mongoosejs-mongodb/
// https://masteringjs.io/tutorials/mongoose/connection-status
//Define a schema
var Schema = mongoose.Schema;

const MyModel = mongoose.model('Test', new Schema({ name: String }));

//var binit;

//INIT DATABASE
async function init(){
  console.log("NEW DATABASE mongoose...");
  //await mongoose.connect('mongodb://localhost/my_database');
  //Get the default connection
  //var db = mongoose.connection;
  //Bind connection to error event (to get notification of connection errors)
  //db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

  console.log(mongoose.connection.readyState); //logs 0
  mongoose.connection.on('connecting', () => { 
    console.log('mongoose connecting')
    //console.log(mongoose.connection.readyState); //logs 2
  });
  mongoose.connection.on('connected', () => {
    console.log('mongoose connected');
    //console.log(mongoose.connection.readyState); //logs 1
  });
  mongoose.connection.on('disconnecting', () => {
    console.log('mongoose disconnecting');
    //console.log(mongoose.connection.readyState); // logs 3
  });
  mongoose.connection.on('disconnected', () => {
    console.log('mongoose disconnected');
    //console.log(mongoose.connection.readyState); //logs 0
  });

  await mongoose.connect('mongodb://localhost:27017/game');
}

init();
module.exports = mongoose;
const {
  checkAliasId
  , createAliasId
  , checkAliasPassphrase

  , aliasCheckLogin
  , setAliasToken
  , aliasLogout
  , aliasVerifyToken

  , aliasSetQuestionsHint
  , getAliasQuestionsHint
  , getAliasHint
  , aliasCheckPassphrase
  , aliasChangePassphrase

}=require('./db_user');

module.exports.checkAliasId = checkAliasId;
module.exports.createAliasId = createAliasId;

module.exports.checkAliasPassphrase = checkAliasPassphrase;

module.exports.aliasCheckLogin = aliasCheckLogin;
module.exports.aliasLogout = aliasLogout;

module.exports.setAliasToken = setAliasToken;
module.exports.aliasVerifyToken = aliasVerifyToken;

module.exports.aliasSetQuestionsHint = aliasSetQuestionsHint;
module.exports.getAliasQuestionsHint = getAliasQuestionsHint;
module.exports.getAliasHint = getAliasHint;
module.exports.aliasCheckPassphrase = aliasCheckPassphrase;
module.exports.aliasChangePassphrase = aliasChangePassphrase;





