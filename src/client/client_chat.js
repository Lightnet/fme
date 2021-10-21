/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

const { el, mount } = redom;
var isMobileView;
function isMobile(){
  // credit to Timothy Huang for this regex test:
  // https://dev.to/timhuang/a-simple-way-to-detect-if-browser-is-on-a-mobile-device-with-javascript-44j3
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    // true for mobile device
    //document.write("mobile device");
    return true;
  }else{
    // false for not mobile device
    //document.write("not mobile device");
    return false;
  }
}
isMobileView=isMobile();
console.log("isMobile:",isMobile());

var socket = io();

socket.on('connect', () => {
  console.log('connect!');
});

socket.on('disconnect', () => {
  console.log('disconnect!');
});

function messageFilter(data){
  let _message = el('div',[
    el('label', data.alias)
    , el('div', data.msg)
  ]
  );
  mount( divChatMessages, _message);
  let objDiv = document.getElementById("messages");
  objDiv.scrollTop = objDiv.scrollHeight;
}

socket.on('chatmessage', (data) => {
  
  console.log('incoming... ');
  console.log('message: ', data);
  messageFilter(data)
});

var divChatMessages=el('div',{
  id:'messages'
  , style:{
    position:'fixed'
    , top:'32px'
    //,left:'calc(50vh - 10px);'
    , left:'32px'
    ,width:'300px'
    , height:'200px'
    , overflow: 'scroll'
    , 'border-style': 'solid'
  }
  },
  [
    el("label","Alias:")
  ]
);

var divChatBox=el('div',{
  id:"chatbox",
  style:{
    position:'fixed'
    ,top:'32px'
    //,left:'calc(50vh - 10px);'
    ,left:'32px'
    //,width:'100%'
    ,'border-style': 'solid'
  }
  },
  [
    el("label","Alias:")
  ]
);

mount(document.body, divChatMessages);
var chatinput = el("input",{id:"chatmessage",value:'chatmessage',onkeyup:getChatMessage})
mount(document.body, chatinput);
var btnchat = el("button",{id:"btnchat",textContent:'Enter'});
mount(document.body, btnchat);

function processmessage(msg){
  socket.emit('chatmessage',msg);
}

function getChatMessage(event){
  event.preventDefault();
  if (event.keyCode === 13) {
    console.log("ENTER!");
    console.log(document.getElementById('chatmessage').value);
    processmessage(document.getElementById('chatmessage').value);
    //document.getElementById("id_of_button").click();
  }
}












