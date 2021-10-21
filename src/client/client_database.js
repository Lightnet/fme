/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

console.log('database test');
// https://pouchdb.com/download.html
// https://pouchdb.com/api.html#create_document

const { el, mount } = redom;

//var db = new PouchDB('http://localhost:5984/pouchdb');
//var db = new PouchDB('http://localhost/pouchdb');
//var db = new PouchDB('pouchdb');
var db = new PouchDB('http://localhost:5984/pouchdb');
db.info().then(function (info) {
  console.log(info);
});

/*
db.put({
  _id: 'mydoc',
  title: 'Heroes'
}).then(function (response) {
  // handle response
  console.log(response);
}).catch(function (err) {
  console.log(err);
});
*/

async function settestdoc(){
  try {
    var response = await db.put({
      _id: 'mydoc',
      title: 'Heroes'
    });
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}

function gettestdoc(){
  db.get('mydoc').then(function (doc) {
    // handle doc
    console.log(doc);
  }).catch(function (err) {
    console.log(err);
  });
}

function deltestdoc(){
  db.get('mydoc').then(function (doc) {
    // handle doc
    //console.log(doc);
    return db.remove(doc);
  }).catch(function (err) {
    console.log(err);
  });
}

var divButtons= el('div',[
  el('button',{onclick:gettestdoc,textContent:'set test doc'}),
  el('button',{onclick:gettestdoc,textContent:'get test doc'}),
  el('button',{onclick:deltestdoc,textContent:'del test doc'})
])

mount(document.body, divButtons);