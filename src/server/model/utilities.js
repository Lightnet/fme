/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

//===============================================
// CHECK POST STRING IF EMPTY
function isEmpty(str) {
  return (typeof str === 'string' && 0 === str.length);
}
exports.isEmpty = isEmpty;
//===============================================
function timeStamp(){
  //return new Date() / 1000;
  return new Date().getTime();
}
exports.timeStamp = timeStamp;
//===============================================
// https://stackoverflow.com/questions/19485353/function-to-convert-timestamp-to-human-date-in-javascript
function timedateclock(time){
  //return new Date(time);
  let plus0 = num => `0${num.toString()}`.slice(-2);
  let d = new Date(time);
  let year = d.getFullYear();
  let monthTmp = d.getMonth() + 1;
  let month = plus0(monthTmp);
  let date = plus0(d.getDate());
  //let hour = plus0(d.getHours()%12);
  let hour = plus0(d.getHours()%12);
  let minute = plus0(d.getMinutes());
  let second = plus0(d.getSeconds());
  let rest = time.toString().slice(-5);

  return `${year}-${month}-${date}_${hour}:${minute}:${second}.${rest}`;
}
exports.timedateclock = timedateclock;
//===============================================
//import { customAlphabet } from 'nanoid/async'
//const nanoid = customAlphabet('1234567890abcdef', 10)
//async function createUser () {
  //user.id = await nanoid()
//}
//exports.createUser = createUser;
const { customAlphabet } = require('nanoid');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 32);
const key32Id = customAlphabet(alphabet, 32);
//nanoid() //=> "S1KBXmrTkI2sNxnx"
//===============================================
async function createUserId() {
  let id = await nanoid()
  return id;
}
exports.createUserId = createUserId;
//===============================================
async function create32Key() {
  let id = await key32Id()
  return id;
}
exports.create32Key = create32Key;
//===============================================
// HTML PAGE
function html_page(data){
  data.title=  data.title || 'dev';
  data.src=  data.src || null;
  let body;
body +=`
<!DOCTYPE html>
<html>
  <head>
    <title>${data.title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://redom.js.org/redom.min.js"></script>
  </head>
  <body>
`;
if(data.src){
  body += `<script src="${data.src}"></script>`;
}
body +=`
  </body>
</html>
`;
return body;
};
exports.html_page=html_page;


function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

exports.parseJwt=parseJwt;
