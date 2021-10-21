/**
 * Created By: Lightnet
 * LICENSE: MIT
 */


const mongoose = require("mongoose");
const { isEmpty, timeStamp, createUserId } =require('../../../model/utilities');

const UserSchema = new mongoose.Schema({
  aliasid: {
    type: String,
    required: true
  },
  alias: {
    type: String
  },
  passphrase: {
    type: String
  },
  username: {
    type: String
  },
  email: {
    type: String
    , default:""
  },
  role:{
    type:String
    , default:'Member'
  },
  ban:{
    type:Number
    , default:0
  },
  key:{
    type:String
    , default:""
  },
  accesskey:{
    type:String
    , default:""
  },
  requestkey:{
    type:String
    , default:""
  },
  token: {
    type: String
    , default:""
  },
  sea:{
    type:String
    , default:""
  },
  auth:{
    type:String
    , default:""
  },
  question1:{
    type:String
    , default:""
  },
  question2:{
    type:String
    , default:""
  },
  hint:{
    type:String
    , default:""
  },
  date: {
    type: String
    , default:""
  }//,
  //age: {
    //type: Number,
    //default: 0,
  //},
});

const User = mongoose.model("User", UserSchema);

module.exports = User;