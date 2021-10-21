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

var divChatMessages=el('div',{
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

var chatinput = el("input",{id:"chatmessage",value:'chatmessage'})

mount(document.body, divChatMessages);














