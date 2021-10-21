/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

/**
  Blank template
 */
const { el, mount, unmount } = redom;
// LABEL
var label_login =el('label','Login');
// FORM
var form_blank=el('form',{
  action:'/login',
  method:'post'
  },
  el('table',[
    el('tr',[
      el('td', el('label','Alias:')),
      el('td', el('input',{type:'text',name:'alias',value:'testalias',placeholder:'Alias Name'}))
    ]),

    el('tr',[
      el('td', el('label','Passphrase:')),
      el('td', el('input',{type:'text',name:'passphrase',value:'testpass',placeholder:'password'}))
    ]),

    el('tr',[
      el('td', el('label',{textContent:'Is Human:',hidden:true})),
      el('td', el('input',{type:'text',name:'isHuman',value:'false', hidden:true}))
    ]),

    el('tr',[
      el('td',{colspan:"2"}, [
        el('a',{href:'/',textContent:'Home'}),
        el('input',{type:'submit',onclick:clicklogin,style:{float:'right'}})
      ])
    ])
  ])
);
//DIV PANEL
var divPanel=el('div',[
  label_login
  ,form_blank
]);
mount(document.body, divPanel);

var divProgress=el('div','Checking Login...');

function clicklogin(){
  console.log('login...');
  divPanel.style.display = "none";
  //unmount(document.body, divPanel); //stop submit action
  mount(document.body, divProgress);
}







