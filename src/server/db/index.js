/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

/**
 * module function calls
 * 
    checkAliasId
  , createAliasId
  , checkAliasPassphrase

  , aliasCheckLogin
  , setAliasToken
  , aliasLogout
  , aliasVerifyToken

  , aliasSetQuestionsHint
  , getAliasQuestionsHint
  , aliasCheckPassphrase
  , aliasChangePassphrase
 *  
*/

//console.log("DATABASE INIT...");
const config=require('../../../config');

//module.exports = require('./gun');
module.exports = require('./mongoose');
//module.exports = require('./sqlite');
//module.exports = require('./better-sqlite');

