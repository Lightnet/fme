/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

console.log('account page');

const { el, mount } = redom;

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

// SET PASSPHRASE HINT
var tablehint=el('table',[
  el('tr',[
    el('td',el('label','Question 1:')),
    el('td',el('input',{id:'question1',value:'a',placeholder:"required for hint"})) // testa
  ]),
  el('tr',[
    el('td',el('label','Question 2:')),
    el('td',el('input',{id:'question2',value:'b',placeholder:"required for hint"})) // testb
  ]),
  el('tr',[
    el('td',el('label','Hint:')),
    el('td',el('input',{id:'hint',value:'c',placeholder:"required 2x question"})) //testc
  ]),
  el('tr',[
    el('td',el('label','Action:')),
    el('td',
      el('button',{id:'sethint',textContent:'Set Hint'}),
      el('button',{id:'gethint',textContent:'Get Hint'})
    )
  ])
]);
// CHANGE PASSPHRASE
var tableChangePassphrase=el('table',[
  el('tr',[
    el('td',el('label','Old Passphrase:')),
    el('td',el('input',{id:'oldpassphrase',value:'testpass'}))
  ]),
  el('tr',[
    el('td',el('label','New Passphrase:')),
    el('td',el('input',{id:'newpassphrase',value:'testpassc'}))
  ]),
  el('tr',[
    el('td',el('label','Action:')),
    el('td',el('button',{id:'btnchangepassphrase',textContent:'Change Passphrase'}))
  ])
]);
// DIV
var divAccount =el('div',tablehint);
var linkhome= el('a',{href:'/',textContent:'Home'});
// MOUNT
mount(document.body, el('div',[linkhome,divAccount,tableChangePassphrase]));

var btnSetHint = document.getElementById('sethint');
btnSetHint.addEventListener('click',function(){
  console.log('set hint...');
  let post = {
    question1: document.getElementById('question1').value,
    question2: document.getElementById('question2').value,
    hint: document.getElementById('hint').value
  };

  fetch('/sethint', {    
    method: "post"
    , body: JSON.stringify(post)
  })
  .then(response => response.json())
  .then((data) => {
    if(data){
      if(data.error){
        console.log("ERROR!!!");
      }
      if(data.message=='POST FORGOT'){
        console.log('FINISH');
      }
      console.log('DATA...',data);
    }
  });
});

var btnGetHint = document.getElementById('gethint');
btnGetHint.addEventListener('click',function(){
  console.log('get hint...');
  fetch('/gethint', {    
    method: "post"
  })
  .then(response => response.json())
  .then((data) => {
    if(data){
      if(data.error){
        console.log("ERROR!!!");
      }
      if(data.message=='FOUND'){
        console.log('FINISH');
        document.getElementById('question1').value = data.data.question1;
        document.getElementById('question2').value = data.data.question2;
        document.getElementById('hint').value = data.data.hint;
      }
      console.log('DATA...',data);
    }
  });
});

var btnchangepassphrase = document.getElementById('btnchangepassphrase');
btnchangepassphrase.addEventListener('click',function(){
  console.log('Change Passphrase...');
  let post = {
    oldpassphrase: document.getElementById('oldpassphrase').value,
    newpassphrase: document.getElementById('newpassphrase').value
  };

  fetch('/changepassphrase', {    
    method: "post"
    , body: JSON.stringify(post)
  })
  .then(response => response.json())
  .then((data) => {
    if(data){
      if(data.error){
        console.log("ERROR!!!");
      }
      if(data.message=='POST FORGOT'){
        console.log('FINISH');
      }
      console.log('DATA...',data);
    }
  });
});