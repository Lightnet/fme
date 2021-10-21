/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

const { el, mount } = redom;

var formGetHint= el("div",{
  id:"gethint"//,
  //onsubmit:"return gethint(event);",
  //action:"/#"
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
        el("label","Question #1: ")
      ]),
      el("td",[
        el("input",{id:"question1",name:"question1",value:"testa"})
      ])
    ]),
    el("tr",[
      el("td",[
        el("label","Question #2: ")
      ]),
      el("td",[
        el("input",{id:"question2",name:"question2",value:"testb"})
      ])
    ]),
    el("tr",[
      el("td",[
        el("label","Hint: ")
      ]),
      el("td",[
        el("input",{id:"hint",name:"hint",value:""})
      ])
    ]),
    el("tr",[
      el("td",{colspan:2},[
        el("a",{href:"/",textContent:"Home"}),
        el("button",{style:{float:"right"},textContent:"Check",onclick:gethint})
      ])
    ]),
  ])
]);

var divpanel=el("div",[
  el("label","Get Hint: "),
  formGetHint
])

mount(document.body,divpanel);

//===============================================
// Theme
//===============================================
// function to set a given theme/color-scheme
function setTheme(themeName) {
  localStorage.setItem('theme', themeName);
  document.documentElement.className = themeName;
  //console.log("themeName:",themeName);
}

// Immediately invoked function to set the theme on initial load
(function () {
  if (localStorage.getItem('theme') === 'theme-dark') {
    setTheme('theme-dark');
  } else {
    setTheme('theme-light');
  }
})();

function gethint(e){
  e.preventDefault();
  console.log('get hint...');
  //console.log(document.getElementById('gethint'));
  //console.log(new FormData(document.getElementById('gethint')));
  let url ="http://localhost:3000/forgot";
  url = '/forgot';

  let post = {
    alias: document.getElementById('alias').value || '',
    question1: document.getElementById('question1').value || '',
    question2: document.getElementById('question2').value || ''
  };

  //JSON.stringify(post)
  // doesn't work with fastify that need some config
  // contentType: "multipart/form-data"
  fetch(url, {    
    method: "post"
    , body: JSON.stringify(post)
    //, header: 'application/json'
    //, contentType: "application/json"
  })
  .then(response => response.json())
  .then((data) => {
    if(data){
      if(data.error){
        console.log("ERROR!!!");
      }
      if(data.message=='FAIL'){
        document.getElementById('hint').value='Invalid';
      }
      if(data.message=='FOUND'){
        console.log('FINISH');
        document.getElementById('hint').value=data.hint;
      }
      if(data.message=='NOTFOUND'){
        document.getElementById('hint').value='Invalid';
      }
      //console.log('DATA...',data);
    }
  });
  return false;
}