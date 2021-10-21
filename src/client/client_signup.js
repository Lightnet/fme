/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

const { el, mount } = redom;

console.log("Hello",hello);

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
// 
//===============================================

var formGetHint= el("form",{
  id:"gethint",
  method:"POST",
  action:"/signup"
},[
  el("table",[
    el("tr",[
      el("td",[
        el("label","Alias: ")
      ]),
      el("td",[
        el("input",{id:"alias",name:"alias",value:"testalias"})
      ])
    ]),
    el("tr",[
      el("td",[
        el("label","Passphrase #1: ")
      ]),
      el("td",[
        el("input",{id:"passphrase1",name:"passphrase1",value:"testpass",placeholder:"passphrase / password"})
      ])
    ]),
    el("tr",[
      el("td",[
        el("label","Passphrase #2: ")
      ]),
      el("td",[
        el("input",{id:"passphrase2",name:"passphrase2",value:"testpass", placeholder:"passphrase / password"})
      ])
    ]),
    el("tr",[
      el("td",{colspan:2},[
        el("a",{href:"/",textContent:"Home"}),
        el("button",{style:{float:"right"},textContent:"Register"})
      ])
    ]),
  ])
]);

mount(document.body,formGetHint);