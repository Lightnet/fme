/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

// https://docs.zeltux.net/support/troubleshooting/better-sqlite3
// https://github.com/JoshuaWise/better-sqlite3/issues/121
// https://www.codegrepper.com/code-examples/sql/sqlite+create+table+if+not+exists
//console.log("Better-SQLite3...");

const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');
const config=require('../../../../config');
const { isEmpty, timeStamp, create32Key, createUserId, parseJwt} = require('../../model/utilities');

//const Gun = require('gun');
const SEA = require('gun/sea');

// https://www.npmjs.com/package/bcrypt
const saltRounds = config.saltRounds || 10;

const dbFile = "./.data/game.db";
//const exists = fs.existsSync(dbFile);
//const sqlite3 = require("sqlite3").verbose();
//const dbWrapper = require("sqlite");
var db;
var options={};

//init
(async ()=>{
  console.log('Init Better-SQLite3');
  
  if(!db){
    console.log('SETUP');
    db = require('better-sqlite3')(dbFile, options);
    /*
    let stmt = db.prepare(`SELECT name
    FROM sqlite_master
    WHERE
      type='table' and name='person'
    ;`);
    let row = stmt.get();
    console.log(row);
    if(row === undefined){
      console.log("WARNING: database appears empty; initializing it.");
      const sqlInit = `
        CREATE TABLE person (
          id   INTEGER PRIMARY KEY,
          name TEXT
        );
        `;
      db.exec(sqlInit);
    }else{
      console.log("EXIST!");
    }
    */
    try {
      const usertable = `
      CREATE TABLE IF NOT EXISTS users ( 
        aliasid PRIMARY KEY,
        alias TEXT,
        username TEXT,
        passphrase TEXT,
        token TEXT,
        pub TEXT,
        sea TEXT,
        auth TEXT,
        question1 TEXT,
        question2 TEXT,
        hint TEXT,
        ban TEXT,
        date TEXT
        );
      `;
      db.exec(usertable);
    } catch (err) {
      console.error(err);
    }
    

  }else{
    console.log('LOAD?');
  }
  
})();

async function checkAliasPassphrase(data, callback){
  let stmt1 = db.prepare('SELECT aliasId, alias, passphrase, sea FROM users Where alias = ?');
  let rslt1 = stmt1.get(data.alias);
  console.log("rslt1"); 

  console.log(rslt1); 
  if(rslt1 != undefined){
    return callback(null,{
      message:'FOUND'
      , passphrase: rslt1.passphrase
      , sea:rslt1.auth
      , aliasid:rslt1.aliasid
    });
  }else{
    return callback(null,{message:'NOTFOUND',alias:data.alias});
  }
}
// https://www.sqlite.org/lang_createtrigger.html
async function setAliasToken(data, callback){
  console.log("DB SET TOKEN");
  console.log(data);
  let stmt1 = db.prepare('SELECT aliasId, alias, token, sea FROM users Where alias = ?');
  let rslt1 = stmt1.get(data.alias);
  console.log(rslt1);

  console.log(data.token);
  let sdl1 = 'UPDATE users SET token = ? WHERE alias = ?';
  let stmt2 = db.prepare(sdl1);
  stmt2.run(data.token, data.alias);
  console.log(stmt2);
}

module.exports = {
  test: async () => {
    console.log("test");
    return "test";
  },
  closeDB :() => {
    console.log("Close DB");
    db.close();
  },
  //====
  checkAliasId:async (alias,callback) => {
    let stmt1 = db.prepare('SELECT alias FROM users Where alias = ?');
    let rslt1 = stmt1.get(alias);
    console.log("rslt1"); 

    console.log(rslt1);
    if(rslt1 === undefined){
      return callback(null,{message:'NOTFOUND'});
    }else{
      return callback(null,{message:'FOUND'});
    }
    //return callback('No args!',null);
  },
  createAliasId:async (data, callback) => {
    //https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md#getbindparameters---row

    //let stmt1 = db.prepare('SELECT alias, passphrase FROM users Where alias = ?');
    let stmt1 = db.prepare('SELECT alias FROM users Where alias = ?');
    let rslt1 = stmt1.get(data.alias);
    console.log("rslt1"); 

    console.log(rslt1); 
    if(rslt1 === undefined){
      let stmt = db.prepare('INSERT INTO users (aliasid, alias, passphrase, pub, sea, auth, date) VALUES (?, ?, ?, ?, ?, ?, ?)');
  
      let sea = await SEA.pair();
      let pub = sea.pub;

      let pass = bcrypt.hashSync(data.passphrase, saltRounds);
      let saltkey = await SEA.work(data.passphrase, data.alias);
      sea = await SEA.encrypt(sea, saltkey);
      let aliasid = await createUserId();
      //console.log('userId:',userId)
      let time = timeStamp();

      let info = stmt.run(
        aliasid
        , data.alias
        , pass
        , pub
        , sea
        , sea
        , time
      );
      console.log(info.changes); // => 1
      console.log("ADD user:",data.alias);
      console.log("ADD passphrase:",data.passphrase);
      return callback(null,{message:'CREATED'});
    }else{
      return callback(null,{message:'EXIST'});
    }
    //return callback('No args!',null);
  },
  checkAliasPassphrase,
  setAliasToken,
  aliasCheckLogin:async (data, callback) => {
    checkAliasPassphrase(data,async function(error,data2){
      if(error){
        //console.log('Login Error!');
        return callback(null);
      }

      if(data2){
        if(data2.message=='FOUND'){
          let decoded = bcrypt.compareSync(data.passphrase, data2.passphrase);
          if(decoded){
            let saltkey = await SEA.work(data.passphrase, data.alias);
            let sea = await SEA.decrypt(data2.sea, saltkey);
            let key = await create32Key();
            saltkey = await SEA.work(key, data.alias);
            sea = await SEA.encrypt(sea, saltkey);
            let token = jwt.sign({ 
              alias: data.alias
              , aliasId:data2.aliasId
              , key:key
              , sea:sea
              //, expiresIn: '24h' //works
              //, expiresIn: '10s' //nope
              //, exp: Math.floor(Date.now() / 1000) + 10, // 10 secs
              , exp: Math.floor(Date.now() / 1000) + 3, // 3 secs
              //set expiry date
              //, exp: Math.floor(Date.now() / 1000) + (60 * 60)
            }, config.tokenKey);

            setAliasToken({alias:data.alias,passphrase:data.passphrase,token:token});

            callback(token);
          }else{
            callback(null);
          }
        }else{
          callback(null);  
        }
      }else{
        callback(null);
      }
    });
  },
  aliasLogout:async (data, callback) => {
    if(data){
      let datatoken;
      try{
        //console.log("PASS TOKEN DB");
        datatoken = jwt.verify(data, config.tokenKey);
      }catch(e){
        //console.log("FAIL TOKEN DB");
        console.log(e);
      }
      if(!datatoken){//in case of expire date
        datatoken = parseJwt(data);
      }

      if(datatoken){
        let stmt = db.prepare(`SELECT alias, token FROM users WHERE alias = ?`);
        let rslt1 = stmt.get(datatoken.alias);
        console.log(rslt1);
        if(rslt1.token == data){
          let stmt2 = db.prepare('UPDATE users SET token = ? WHERE alias = ?');
          stmt2.run('', datatoken.alias);
          console.log(stmt2);
          return callback('PASS');
        }else{
          return callback('FAIL');
        }
      }else{
        return callback('FAIL');
      }
    }else{
      return callback('FAIL');
    }
  },
  aliasVerifyToken:async (data, callback) => {
    //convert hash to data array object
    let ptoken=parseJwt(data);
    let stmt1 = db.prepare('SELECT alias, token FROM users Where alias = ?');
    let rslt1 = stmt1.get(ptoken.alias);
    console.log("rslt1"); 

    console.log(rslt1); 
    if(rslt1){
      if(rslt1.token == data){
        let stmt2 = db.prepare('UPDATE users SET token = ? WHERE alias = ?');
        stmt2.run('', ptoken.alias);
      }
    }
  }
  //=============================================
}

