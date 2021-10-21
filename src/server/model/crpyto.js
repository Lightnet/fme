/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

// https://attacomsian.com/blog/nodejs-encrypt-decrypt-data
// https://codeforgeek.com/encrypt-and-decrypt-data-in-node-js/
// 

const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
//const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const secretKey = '12345678901234567890123456789012';
const iv = crypto.randomBytes(16);

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
};

const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
  return decrpyted.toString();
};

function encryptKey(text, keyId){
  const cipher = crypto.createCipheriv(algorithm, keyId, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
};

function decryptKey(hash, keyId){
  const decipher = crypto.createDecipheriv(algorithm, keyId, Buffer.from(hash.iv, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
  return decrpyted.toString();
};

module.exports = {
  encrypt,
  decrypt,
  encryptKey,
  decryptKey
};


//const { encrypt, decrypt } = require('./crypto');
//const hash = encrypt('Hello World!');
//console.log(hash);
// {
//     iv: '237f306841bd23a418878792252ff6c8',
//     content: 'e2da5c6073dd978991d8c7cd'
// }
//const text = decrypt(hash);
//console.log(text); // Hello World!
