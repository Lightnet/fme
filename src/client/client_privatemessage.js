/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

/**
  Blank template
 */
const { el, mount } = redom;

// FORM
var divPrivateMessagePanel=el('div',{
  },
  el("table",[
    el("tr",[
      el("td", el("label",{textContent:"Message:"})),
      el("td", el("input",{id:'pminput',onkeyup:typingMessage,value:"test content"})),
      el("td", el("button",{onclick:btnSend,textContent:'Sent'})),
    ])
  ])
);

var navMenuHome=el('a',{href:'/',textContent:'Home'});
var navMenuLout=el('a',{href:'/logout',textContent:'Logout'});
var btnGetContactList=el('button',{onclick:btnGetContacts,textContent:'Get Contacts'});
var btnGetPMList=el('button',{onclick:getPrivateMessageList,textContent:'Get Messages'});
var divMessages=el('div',{
  id:'messages',
  style:{
    height:'200px'
    , width:'200px'
    , 'overflow-y':'scroll'
    , 'border-style':'solid'
  }
})

var div_panel=el("div",[
  navMenuHome,
  el('span',' - | - '),
  el('button',{onclick:btnGetPublicKey,textContent:'My Public Key'}),
  el('label',{textContent:'Public Key'}),
  el('select',{id:'pmcontacts',onchange:selectPMPublicKey,textContent:''},el('option',{default:true,disabled:false},'Select PM Contacts')),

  el('input',{id:'pmpublickey',placeholder:'Public Key'}),
  
  el('button',{onclick:addContact,textContent:'+'}),
  el('button',{onclick:removeContact,textContent:'-'}),
  el('label',{textContent:'Status:'}),
  el('label',{textContent:'None'}),
  el('span',' - | - '),
  navMenuLout
  ,divPrivateMessagePanel
  ,btnGetContactList
  ,btnGetPMList
  , divMessages
]);
mount(document.body, div_panel);
// https://www.w3.org/TR/clipboard-apis/#async-clipboard-api
function btnGetPublicKey(){
  fetch('/account/pubkey',{
    method: 'GET',
    credentials: 'same-origin', // include, *same-origin, omit
    //body: JSON.stringify({pub:$('#pmpublickey').val()})
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if(data){
      if(data.publickey){
        try{
          navigator.clipboard.writeText(data.publickey)
        }catch(err){
          console.log(err);
        }
      }
    }
  });
}

function btnGetContacts(){
  fetch('/privatemessage/listcontact',{
    method: 'GET',
    credentials: 'same-origin', // include, *same-origin, omit
    //body: JSON.stringify({pub:$('#pmpublickey').val()})
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if(data){
      if(data.list){
        let list = data.list;
        for(let i in list){
          console.log(list[i]);
          let option = el('option',{id:list[i].pub,value:list[i].pub},list[i].alias);
          $('#pmcontacts').append(option);
        }
      }
    }
  });
}
btnGetContacts();

function selectPMPublicKey(){
  console.log('select?');
  console.log($('#pmcontacts').val());
  if($('#pmcontacts').val() != 'Select PM Contacts'){
    $('#pmpublickey').val($('#pmcontacts').val());
  }
}

function typingMessage(event){
  console.log('test...')
  console.log(event.keyCode)
  if(event.keyCode==13){
    console.log('test')
    processMessage();
  }
}

function btnSend(){
  console.log('blank');
  processMessage();
}

function processMessage(){
  console.log($('#pminput').val());
  let msg = ($('#pminput').val() || '').trim();
  console.log(msg);
  if(!msg){
    console.log('EMPTY!');
    return;
  }

  fetch('/privatemessage',{
    method: 'POST',
    credentials: 'same-origin', // include, *same-origin, omit
    body: JSON.stringify({pub:$('#pmpublickey').val(),msg:msg})
  })
  .then(response => response.json())
  .then(data => console.log(data));
}
// RBY-QnjrJFHLchvfCWCpr8_EDk48ALcwJK0DEkKH-Vo.Eo6h9qTq646XvWPvqEgHCZNutEUDiquFsFARwP7UWfA
function addContact(){
  console.log($('#pmpublickey').val())

  fetch('/privatemessage/addcontact',{
    method: 'POST',
    credentials: 'same-origin', // include, *same-origin, omit
    body: JSON.stringify({pub:$('#pmpublickey').val()})
  })
  .then(response => response.json())
  .then(data => console.log(data));
}

function removeContact(){
  console.log($('#pmpublickey').val())

  fetch('/privatemessage/removecontact',{
    method: 'POST',
    credentials: 'same-origin', // include, *same-origin, omit
    body: JSON.stringify({pub:$('#pmpublickey').val()})
  })
  .then(response => response.json())
  .then(data => console.log(data));
}

function getPrivateMessageList(){
  console.log($('#pminput').val());
  divMessages.textContent = '';
  let msg = ($('#pminput').val() || '').trim();
  console.log(msg);
  if(!msg){
    console.log('EMPTY!');
    return;
  }

  fetch('/privatemessage/list',{
    method: 'POST',
    credentials: 'same-origin', // include, *same-origin, omit
    body: JSON.stringify({pub:$('#pmpublickey').val()})
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if(data.ok){
      let list = data.list;

      
      for(let i in list){
        
        let msg = el('div',{id:list[i].id,textContent:list[i].msg});
        //msg
        divMessages.append(msg);
        var element = document.getElementById('messages');
        //var element = document.divMessages;
        element.scrollTop = element.scrollHeight - element.clientHeight;
      }
    }
  });
}


