/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

/**
 * Information:
 *  Database
 */
// https://www.npmjs.com/package/sqlite#getting-a-single-row
// https://stackabuse.com/a-sqlite-tutorial-with-node-js/
// https://www.npmjs.com/package/sqlite

// https://www.sqlitetutorial.net/sqlite-where/
// https://stackabuse.com/a-sqlite-tutorial-with-node-js/#updatingdata


console.log("Sqlite INIT...");
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');
const SEA = require('gun/sea');
const config=require('../../../../config');
const saltRounds = config.saltRounds || 10;

const { isEmpty, timeStamp, create32Key, createUserId, parseJwt} = require('../../model/utilities');

const dbFile = "./.data/game.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
var db;
/* 
We're using the sqlite wrapper so that we can make async / await connections
- https://www.npmjs.com/package/sqlite
*/
dbWrapper
  .open({
    filename: dbFile,
    driver: sqlite3.Database
  })
  .then(async dBase => {
    db = dBase;

    // We use try and catch blocks throughout to handle any database errors
    try {
      // The async / await syntax lets us write the db operations in a way that won't block the app


      /*
      if (!exists) {
        // Database doesn't exist yet - create Choices and Log tables
        await db.run(
          "CREATE TABLE Choices (id INTEGER PRIMARY KEY AUTOINCREMENT, language TEXT, picks INTEGER)"
        );

        // Add default choices to table
        await db.run(
          "INSERT INTO Choices (language, picks) VALUES ('HTML', 0), ('JavaScript', 0), ('CSS', 0)"
        );

        await db.run(
          "CREATE TABLE Users (id INTEGER PRIMARY KEY AUTOINCREMENT, alias STRING, passphrase STRING, question1 STRING, question2 STRING, hint STRING, sea STRING, auth STRING, token STRING, hint STRING, date STRING,   picks INTEGER)"
        );

        // Log can start empty - we'll insert a new record whenever the user chooses a poll option
        await db.run(
          "CREATE TABLE Log (id INTEGER PRIMARY KEY AUTOINCREMENT, choice TEXT, time STRING)"
        );
      } else {
        // We have a database already - write Choices records to log for info
        console.log(await db.all("SELECT * from Choices"));

        //If you need to remove a table from the database use this syntax
        //db.run("DROP TABLE Logs"); //will fail if the table doesn't exist
      }
      */

      if (!exists) {
        // Database doesn't exist yet - create Choices and Log tables
        await db.run(
          `CREATE TABLE IF NOT EXISTS users (
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
            );`
        );
      }
    } catch (dbError) {
      console.error(dbError);
    }
});

async function checkAliasPassphrase(data, callback){
  let result = await db.get(`SELECT alias, passphrase, auth FROM users WHERE alias = ?`, data.alias );

  console.log("checkAliasPassphrase result");
  console.log(result);

  if(result != undefined){
    return callback(null,{
      message:'FOUND'
      , passphrase: result.passphrase
      , sea: result.auth
      , aliasid: result.aliasid
    });
  }else{
    return callback(null,{message:'NOTFOUND',alias:data.alias});
  }
}

async function setAliasToken(data, callback){
  console.log("DB SET TOKEN");
  console.log(data);

  let result = await db.run(`
    UPDATE users SET token = ? WHERE alias = ?`
    , data.token
    , data.alias
  );
  console.log(result);
  if(result.changes==1){
    console.log("UPDATE");
  }else{
    console.log("UPDATE ERROR!");
  }
}
//===============================================
//
//===============================================
module.exports = {
  test: async () => {
    console.log("test");
    return "test";
  },
  getOptions: async () => {

  },
  getLogs: async () => {

  },
  clearHistory: async () => {
  },
  //====
  // https://www.npmjs.com/package/sqlite
  checkAliasId:async (alias,callback) => {

    let result = await db.get(`SELECT alias FROM users WHERE alias = ?`, alias );
    //console.log("result>>>");
    console.log(result);
    //console.log("result>>>");
    if(result === undefined){
      //console.log("NOT FOUND!");
      return callback(null,{message:'NOTFOUND'});
    }else{
      //console.log("FOUND!");
      return callback(null,{message:'FOUND'});
    }
    //return callback('No args!',null);
  },
  createAliasId:async (data, callback) => {
    //check if user name exist
    let result0  = await db.get(`SELECT alias FROM users WHERE alias = ?`, data.alias );
    console.log(result0);
    if(result0 === undefined){//if does not exist add
      console.log(data);
      let sea = await SEA.pair();
      let pub = sea.pub;

      let pass = bcrypt.hashSync(data.passphrase, saltRounds);
      let saltkey = await SEA.work(data.passphrase, data.alias);
      sea = await SEA.encrypt(sea, saltkey);
      let aliasid = await createUserId();
      //console.log('userId:',userId)
      let time = timeStamp();

      let result = await db.run(`
      INSERT INTO users (
        aliasid, 
        alias, 
        passphrase, 
        pub, 
        sea, 
        auth, 
        date
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      
          aliasid
        , data.alias
        , pass
        , pub
        , sea
        , sea
        , time
      );
      console.log("result>> CREATE??");
      console.log(result);
      if(result.changes == 1){
        return callback(null,{message:'CREATED'});
      }
    }else{
      console.log('EXIST');
      return callback(null,{message:'EXIST'});
    }
    return callback('No args!',null);
  },
  checkAliasPassphrase,
  setAliasToken,
  aliasCheckLogin:async (data, callback) => {
    checkAliasPassphrase(data,async function(error,data2){
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
              , exp: Math.floor(Date.now() / 1000) + 5, // 10 secs
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
  aliasVerifyToken:async (data, callback) => {
    let ptoken=parseJwt(data);
    let result0  = await db.get(`SELECT alias, token FROM users WHERE alias = ?`, ptoken.alias);

    //need to check token is expire

    if(result0){
      if(result0.token == data){
        
        let result1  = await db.run(`UPDATE users SET token='' WHERE alias = ?`, ptoken.alias);
        //console.log(result0);
        if(result1.changes==1){
          console.log("DB TOKEN CLEAR");
          //return callback('PASS');
        }
      }
    }
    //return callback('FAIL');
  },
  aliasLogout:async (data, callback) => {
    //console.log("L>>>OGOUT",data);
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
      //console.log("parseJwt(data)>>>>>>>>");
      //console.log(parseJwt(data));
      if(datatoken){
        //console.log(datatoken);
        let result0  = await db.get(`SELECT alias, token FROM users WHERE alias = ?`, datatoken.alias);
        //console.log("result0");
        //console.log(result0);
        if(result0){
          if(result0.token == data){
            //console.log("PASS TOKEN");
            let result0  = await db.run(`UPDATE users SET token='' WHERE alias = ?`, datatoken.alias);
            //console.log(result0);
            if(result0.changes==1){
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
      }else{
        return callback('FAIL');
      }
    }else{
      return callback('FAIL');
    }
  }
}

