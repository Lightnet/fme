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

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
//===============================================
// STYLE
//===============================================
/*
var htmlstyle=el("style",{textContent:`
background-color: #333;
overflow: hidden;
`});
mount(document.head, htmlstyle);
*/

//===============================================
// Theme
//===============================================
// function to set a given theme/color-scheme
function setTheme(themeName) {
  localStorage.setItem('theme', themeName);
  document.documentElement.className = themeName;
  //console.log("themeName:",themeName);
}
// function to toggle between light and dark theme
function toggleTheme() {
  if (localStorage.getItem('theme') === 'theme-dark') {
    setTheme('theme-light');
  } else {
    setTheme('theme-dark');
  }
}

function btnThemeLight(){
  setTheme('theme-light');
}

function btnThemeDark(){
  setTheme('theme-dark');
}

// Immediately invoked function to set the theme on initial load
(function () {
  if (localStorage.getItem('theme') === 'theme-dark') {
    setTheme('theme-dark');
  } else {
    setTheme('theme-light');
  }
})();


//===============================================
// CONTENT
//===============================================
var div_content=el("div",{textContent:"Content",
  style:{
  position:'fixed'
  ,top:'32px'
  ,width:'100%'
  }
});
mount(document.body, div_content);

//===============================================
// Nav Bar Top
//===============================================
var DivNavBarTop =el("div",{
  textContent:""
  ,style:{
    position:'fixed'
    ,top:0
    ,width:'100%'
    ,height:'32px'
  }
},[
  el('button',{onclick:btnToggle,textContent:'Menu',style:{
    float:'left'
  }}),
  el('span',{id:'navMenu',
      style:{
        float:'left'
      }
    },[
    
    el('span','|-'),
    el('a',{href:'/account',textContent:'Account'}),
    el('span','-|-'),
    //el('a',{href:'/about',textContent:'About'}),
    //el('span','-|-'),
    el('a',{href:'/message',textContent:'Message'}),
    el('span','-|-'),
    el('a',{href:'/chat',textContent:'Chat'}),
    el('span','-|-'),
    el('a',{href:'/game',textContent:'Game'}),
    el('span','-|-'),
    el('a',{href:'#',textContent:'Settings'}),
    el('span','-|-'),
    el('a',{href:'/admin',textContent:'Admin'}),
    el('span','-|-'),
    el('a',{href:'/logout',textContent:'Logout'}),
    //el('span',''),
    //el('button',{onclick:getDbInfo,textContent:'pouchdb'}),
    //el('button',{onclick:TestTrigger,textContent:'jqbtntest'}),
  ])
]);
mount(document.body, DivNavBarTop);

function btnToggle(){
  let menuDisplay = document.getElementById('navMenu').style.display;
  if(menuDisplay === 'none'){
    document.getElementById('navMenu').style.display = 'block';
  }else{
    document.getElementById('navMenu').style.display = 'none';
  }
}

//===============================================








