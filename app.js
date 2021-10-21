/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

console.log('init Nodejs server...');

if(process.env.NODE_ENV !== 'production') console.log('DEV MODE');
console.log('process.env.NODE_ENV : >> ',process.env.NODE_ENV);

require('./src/server/fastifty_server');












