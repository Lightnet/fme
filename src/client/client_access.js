/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

/**
  Design the login, forgot, singup access ui component.
 */
// https://www.w3schools.com/howto/howto_js_draggable.asp

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
//===============================================
// LOGIN PANEL
//===============================================
// FORM LOGIN
var formLogin=el('form'
  ,{
    action:'/login',
    method:'post'
    ,style:{
      position:'fixed'
      ,top:'32px'
      //,left:'calc(50vh - 10px);'
      ,left:'calc(50% - 100px)'
      //,width:'100%'
      ,'border-style': 'solid'
    }
  }
  ,el("table",[
    el("tr",[
      el("td", {colspan:"2"}, el("Label",{textContent:"Access"}))
    ])
    ,el("tr",[
      el("td", el("label","Alias:")),
      el("td", el("input",{name:"alias",id:"alias",value:'testalias'}))
    ])
    ,el("tr",[
      el("td", el("label","Passphrase:")),
      el("td", el("input",{name:"passphrase",id:"passphrase",value:'testpass'}))
    ])
    ,el("tr",[
      el("td", el("label",{textContent:"Is Human?:"
        ,hidden:true
      })),
      el("td", el("input",{
        name:"ishuman"
        ,type:'checkbox'
        ,value:"false"
        ,hidden:true
      }))
    ])
    ,el("tr",[
      //el("td", el("label","Actions:")),
      el("td",{colspan:2} ,[el("button",{type:"Submit",textContent:"Login"}),el("button",{type:"button",onclick:btnCloseLogin,textContent:"Cancel"})]),
    ])
  ])
);

var divLoginPanel=el("div",formLogin);
mount(document.body, divLoginPanel);
divLoginPanel.style.display = 'none';
function btnCloseLogin(event){
  //let menuDisplay = divLoginPanel.style.display;
  divLoginPanel.style.display = 'none';
}
// https://zellwk.com/blog/style-hover-focus-active-states/

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
var divSettings=el('div',
  {
  style:{
      position:'fixed'
      ,top:'32px'
      ,left:'32px'
      //,width:'100%'
      ,'border-style': 'solid'
    }
  }
  ,el("table",[
    el("tr",[
      el("td", {colspan:"2"}, el("Label",{textContent:"Settings"}))
    ])
    ,el("tr",[
      el("td", el("label","Themne Color:")),
      el("td", [el("a",{href:'#',onclick:btnThemeLight,textContent:'light'}),el('span','-|-'),el("a",{href:'#',onclick:btnThemeDark,textContent:'dark'})]  )
    ])
    ,el("tr",[
      //el("td", el("label","Actions:")),
      el("td",{colspan:2} ,[el("button",{type:"button",textContent:"Save"}),el("button",{type:"button",textContent:"Reset"})]),
    ])
  ])
);
mount(document.body, divSettings);
divSettings.style.display = 'none';
function btnToggleSettings(event){
  if(divSettings.style.display === 'none'){
    divSettings.style.display = 'block';
  }else{
    divSettings.style.display = 'none';
  }
  return false;
}
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
    el('a',{href:'#',onclick:btnToggleLogin,textContent:'Login'}),
    el('span','-|-'),
    el('a',{href:'/signup',textContent:'Sign Up'}),
    el('span','-|-'),
    el('a',{href:'/forgot',textContent:'Forgot'}),
    el('span','-|-'),
    //el('a',{href:'/about',textContent:'About'}),
    //el('span','-|-'),
    el('a',{href:'#',onclick:btnToggleSettings,textContent:'Settings'}),
    el('span','-|-'),
    el('a',{href:'/admin',textContent:'Admin'}),
    el('span','-|'),
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

function btnToggleLogin(){
  let menuDisplay = divLoginPanel.style.display;
  if(menuDisplay === 'none'){
    divLoginPanel.style.display = 'block';
  }else{
    divLoginPanel.style.display = 'none';
  }
  return false;
}