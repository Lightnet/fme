/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');
const config=require('../../../../config');
const { isEmpty, timeStamp, create32Key, createUserId, parseJwt} = require('../../model/utilities');

//const Gun = require('gun');
const SEA = require('gun/sea');

// https://www.npmjs.com/package/bcrypt
const saltRounds = config.saltRounds || 10;

const mongoose = require('mongoose');

// https://stackoverflow.com/questions/10811887/how-to-get-all-count-of-mongoose-model
const UserModel = require('./models/model_user');

//===============================================
// CHECK ALIAS ID
//===============================================
function checkAliasId(alias,callback){

  if(mongoose.connection.readyState!=1){
    return callback('Database not Init/Error!',null);
  }

  ////check ID match count
  UserModel.count({alias:alias}, function( err, count){
    //console.log( "Number of users:", count );
    if(count==0){
      return callback(null,{message:'NOTFOUND'});
    }else{
      return callback(null,{message:'FOUND'});
    }
  });
}
exports.checkAliasId = checkAliasId;
//===============================================
// Create Account
//===============================================
async function createAliasId(data, callback){
  //console.log("DB STATUS:",mongoose.connection.readyState);
  if(mongoose.connection.readyState!=1){
    return callback('Database not Init/Error!',null);
  }
  //console.log(data);
  //{ alias: 'testalias', passphrase: 'testpass' }
  let sea = await SEA.pair();
  let pub = sea.pub;
  let pass = bcrypt.hashSync(data.passphrase, saltRounds);
  let saltkey = await SEA.work(data.passphrase, data.alias);
  sea = await SEA.encrypt(sea, saltkey);
  let aliasid = await createUserId();
  //console.log('userId:',userId)
  let time = timeStamp();
  //return callback(null,{message:'CREATED'});
  let newuser = new UserModel({
    aliasid: aliasid
    , alias: data.alias
    , username: data.alias
    , passphrase: pass
    , pub: pub
    , sea : sea
    //, auth: sea
    , date: time
  });
  newuser.save((err, u) => {
    if (err) {
      //return console.error(err);
      return callback(null,{message:'ERROR'});
    }
    console.log(u.alias);
    return callback(null,{message:'CREATED'});
  });
  //return callback('No args!',null);
}
exports.createAliasId = createAliasId;
//===============================================
// GET ALIAS PASSPHRASE (password)
//===============================================
async function checkAliasPassphrase(data, callback){
  //console.log('PROGRESS PASSWORD');
  if(mongoose.connection.readyState!=1){
    return callback('Database not Init/Error!',null);
  }

  if(data){
    //if(isEmpty(data.alias)==true || isEmpty(data.passphrase)==true){
    if(isEmpty(data.alias)==true){
      //return callback('Empty alias || passphrase!');
      return callback('Empty Alias',null);
    }

    let users = await UserModel.find({
      alias:data.alias
    });
    //console.log("users:",users.length);
    //console.log(users);
    if(users.length==1){
      return callback(null,{
        message:'FOUND'
        , passphrase: users[0].passphrase
        , sea:users[0].sea
        //, aliasId:users[0].aliasid
      });
    }else{
      return callback(null,{message:'NOTFOUND',alias:data.alias});
    }
    //return callback(null,{message:'NOTFOUND',alias:data.alias});
  }else{
    return callback('No args!',null);
  }
}
exports.checkAliasPassphrase = checkAliasPassphrase;
//===============================================
// Check Alias Login
//===============================================
async function aliasCheckLogin(data,callback){
  checkAliasPassphrase(data,async function(error,data2){
    if(error){
      //console.log('Login Error!');
      return callback(null);
    }

    if(data2){
      if(data2.message=='FOUND'){
        let decoded = bcrypt.compareSync(data.passphrase, data2.passphrase);
        if(decoded){
          //TODOLIST need to work encoding safe data
          let saltkey = await SEA.work(data.passphrase, data.alias);
          let sea = await SEA.decrypt(data2.sea, saltkey);
          let key = await create32Key();
          saltkey = await SEA.work(key, data.alias);

          let accesskey = await create32Key();

          //need to be encrypt that token can be read
          sea = await SEA.encrypt(sea, saltkey); 
          //console.log('///////////////////////////////////////////');
          //console.log(data2)
          //console.log('///////////////////////////////////////////');
          //console.log('config.tokenKey:',config.tokenKey);

          let token = jwt.sign({ 
            alias: data.alias
            //, aliasId:data2.aliasId
            //, key:key
            , accesskey: accesskey
            , sea:sea
            , expiresIn: '24h' //works
            //, expiresIn: '10s' //nope
            //, exp: Math.floor(Date.now() / 1000) + 10, // 10 secs
            //set expiry date
            //, exp: Math.floor(Date.now() / 1000) + (60 * 60)
          }, config.tokenKey);
          setAliasToken({alias:data.alias,passphrase:data.passphrase,token:token,key:key,accesskey:accesskey});
          //console.log('typeof token');
          //console.log(typeof token);
          //console.log(token);
          //return callback(null,{message:'FOUND',token:token});
          callback(token);
        }else{
          callback(null);  
        }
      }else if(data2.message=='NOTFOUND'){
        callback(null);
      }else{
        callback(null);
      }
    }else{
      callback(null);
    }
    //console.log('END loginAliasSync');
  });
}
exports.aliasCheckLogin = aliasCheckLogin;
//===============================================
// set Alias Token
//===============================================
// https://mongoosejs.com/docs/tutorials/findoneandupdate.html
async function setAliasToken(data, callback){
  if(isEmpty(data.alias)==true){
    //return callback('Empty alias || passphrase!');
    return callback('Empty Alias',null);
  }
  let filter = {
    alias:data.alias
  };
  let update ={
    token: data.token
    , key: data.key
    , accesskey: data.accesskey
  };
  let user = await UserModel.findOneAndUpdate(filter,update,{new: true});
  //console.log("DB TOKEN SET :",user.token);
};
exports.setAliasToken = setAliasToken;
//===============================================
// Alias LOGOUT
//===============================================
// NEEDED? DB clear token, cookie, session?
async function aliasLogout(data, callback){
  if(mongoose.connection.readyState!=1){
    return callback('Database not Init/Error!',null);
  }

  if(data){
    //let datatoken = jwt.verify(data, config.tokenKey);
    let datatoken;
    try{
      //console.log("PASS TOKEN DB");
      datatoken = jwt.verify(data, config.tokenKey);
    }catch(e){
      //console.log("FAIL TOKEN DB");
      console.log(e);
    }

    if(datatoken){
      //console.log("datatoken>>");
      //console.log(datatoken);
      let filter = {
        alias:datatoken.alias
      };
      let update ={
        token: ""
      };
    
      let user = await UserModel.findOneAndUpdate(filter,update,{new: true});
      //console.log(user);
      if(user){
        return callback('PASS');
      }else{
        return callback('FAIL');
      }
    }else{
      callback('FAIL');
    }
    //console.log('nothing yet...');
  }else{
    //console.log('Alias Logout NULL field!');
    callback('FAIL');
  }

}
exports.aliasLogout = aliasLogout;
//===============================================
// Verfy Token
// check token is valid date if not clear token
//===============================================
async function aliasVerifyToken(data, callback){
  //console.log("TOKEN: ",data);
  //no check get alias
  let ptoken=parseJwt(data);
  //console.log(ptoken);

  //database users find alias
  let users = await UserModel.find({
    alias:ptoken.alias
  });

  //check if user found
  if(users.length==1){
    //check token from user < token and compare database and cookie token
    if(users[0].token==data){
      //console.log("MATCH TOKEN KEY!");
      let bdelete=false;
      try {
        jwt.verify(data, config.tokenKey);
      }catch(e){
        bdelete=true;
      }

      if(bdelete){
        console.log("DELETE TOKEN!!!");
        //console.log(users[0]);
        let filter = {
          alias:users[0].alias
        };
        let update ={
          token: ""
        };
        //database update clear
        let user = await UserModel.findOneAndUpdate(filter,update,{new: true});
        //console.log("DB aliasVerifyToken:",user.token);
        return callback(null);
      }else{
        let key = users[0].key;
        let saltkey = await SEA.work(key, users[0].alias);
        let sea = await SEA.decrypt(ptoken.sea, saltkey);
        //console.log(sea);
        return callback(sea);  
      }
    }else{
      return callback(null);
    }
  }else{
    return callback(null);
  }
}
exports.aliasVerifyToken = aliasVerifyToken;
//===============================================
// ALIAS SET HINT
//===============================================
async function aliasSetQuestionsHint(data,callback){
  let sec = await SEA.secret(data.sea.epub, data.sea);
  let enc_question1 = await SEA.encrypt(data.question1, sec);
  let enc_question2 = await SEA.encrypt(data.question2, sec);
  let enc = await SEA.work(data.question1, data.question2);
  let enc_hint = await SEA.encrypt(data.hint,enc);
  //console.log("HINT!");

  let users = await UserModel.find({
    alias:data.alias
  }); 

  if(users.length==1){
    //console.log(enc_question1);
    //console.log(enc_question2);
    //console.log(enc_hint);

    let filter = {
      alias:users[0].alias
    };
    let update ={
      question1: enc_question1
      , question2: enc_question2
      , hint: enc_hint
    };

    let user = await UserModel.findOneAndUpdate(filter,update,{new: true});
    //console.log("DATA:",user);
    //need to check?
    if(user){
      return callback('PASS');
    }else{
      return callback('FAIL');
    }
  }else{
    return callback('FAIL');
  }
}
exports.aliasSetQuestionsHint = aliasSetQuestionsHint;
//===============================================
// ALIAS GET QUESTIONS & HINT
//===============================================
async function getAliasQuestionsHint(data,callback){

  let users = await UserModel.find({
    alias:data.alias
  });

  if(users.length==1){
    let sec = await SEA.secret(data.sea.epub, data.sea);
    let question1 = await SEA.decrypt(users[0].question1, sec);
    let question2 = await SEA.decrypt(users[0].question2, sec);
    let hint = users[0].hint;
    sec = await SEA.work(question1,question2);
    hint = await SEA.decrypt(hint, sec);

    callback({
      hint:hint
      , question1:question1
      , question2:question2
    });
  }else{
    callback('FAIL');
  }
}
exports.getAliasQuestionsHint = getAliasQuestionsHint;
//===============================================
// ALIAS GET HINT
//===============================================
async function getAliasHint(data,callback){

  let users = await UserModel.find({
    alias:data.alias
  });

  if(users.length==1){
    let hint = users[0].hint;
    //console.log("DATA");
    //console.log(data);
    //console.log(hint);
    //let sec = await SEA.secret(data.sea.epub, data.sea);
    //let question1 = await SEA.decrypt(users[0].question1, sec);
    //let question2 = await SEA.decrypt(users[0].question2, sec);
    let sec = await SEA.work(data.question1,data.question2);
    //let sec = await SEA.work("1","2");
    hint = await SEA.decrypt(hint, sec);
    //console.log(hint);
    if(hint){
      callback(hint);
    }else{
      callback('FAIL');
    }
  }else{
    callback('FAIL');
  }
  users=null;
}
exports.getAliasHint = getAliasHint;
//===============================================
// ALIAS CHANGE PASSPHRASE
//===============================================
async function aliasChangePassphrase(data,callback){
  //look user name in database
  let users = await UserModel.find({
    alias:data.alias
  });
  //check user exist
  if(users.length==1){
    let user = users[0];
    //console.log("data",data);
    let decoded = bcrypt.compareSync(data.oldpassphrase, user.passphrase);
    //console.log("decoded:",decoded);
    // if passphrase is verify
    if(decoded){
      //callback('PASS');
      let sea =user.auth;
      //console.log(sea);
      let oldSaltKey = await SEA.work(data.oldpassphrase, data.alias);
      sea = await SEA.decrypt(sea, oldSaltKey);
      //console.log(sea);
      let newSaltKey = await SEA.work(data.newpassphrase, data.alias);
      sea = await SEA.encrypt(sea, newSaltKey);
      //console.log(sea);
      let pass = bcrypt.hashSync(data.newpassphrase, saltRounds);

      let filter = {
        alias:user.alias
      };
      let update ={
          auth:sea
        , passphrase: pass
      };
      let muser = await UserModel.findOneAndUpdate(filter,update,{new: true});
      console.log("DATA:",muser);
      //need to check?
      if(muser){
        return callback('PASS');
      }else{
        return callback('FAIL');
      }
    }else{
      //if incorrect passphrase
      return callback('FAIL');
    }
  }
}
exports.aliasChangePassphrase = aliasChangePassphrase;



