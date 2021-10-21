/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

/**
  Blank template
 */
const { el, mount } = redom;

/*
// FORM
var form_blank=el('form',{
  action:'/ticket',
  method:'post'
  },
  el("table",[
    el("tr",[
      el("td", el("label","Actions:")),
      el("td", el("input",{type:"submit",onclick:clickBlank})),
    ])
  ])
);
var link_home=el('a',{href:'/',textContent:'Home'});
var div_panel=el("div",[
  link_home,
  form_blank
]);
mount(document.body, div_panel);
function clickBlank(){
  console.log('blank');
}
*/
//===============================================
// MENU
var divMenu=el('div',[
  el('a',{href:'/',textContent:'Home'})
  , el('button',{onclick:toggleDivStatus, textContent:'Status'})
  , el('button',{onclick:toggleDivProgress, textContent:'Progress'})
  , el('button',{onclick:toggleDivReport, textContent:'Report'})
]);
mount(document.body, divMenu);
//===============================================
// DIV STATUS
var divStatus=el('div',{
  style:{
    //position:'fixed'
  }
},
el('div',{textContent:''},[
  el('label',{textContent:'Text Content:'},el('label',{id:'textcontent',textContent:'0'})),
  el('br'),
  el('label',{textContent:'Image Content:'},el('label',{id:'imagecontent',textContent:'0'})),
  el('br'),
  el('label',{textContent:'Audio Content:'},el('label',{id:'audiocontent',textContent:'0'})),
  el('br'),
  el('label',{textContent:'Krama:'},el('label',{id:'krama',textContent:'0'})),
  el('br'),
])

);
mount(document.body, divStatus);
//===============================================
// DIV PROGRESS
var divProgress=el('div',{
  style:{
    //position:'fixed'
  }
},
el('div',{textContent:''},[
  el('label',{textContent:'Progress:'},el('label',{id:'tprogress',textContent:'0'})),
  el('label',{textContent:'Pending:'},el('label',{id:'tpending',textContent:'0'})),
  el('label',{textContent:'Done:'},el('label',{id:'tdone',textContent:'0'})),
])

);
mount(document.body, divProgress);
divProgress.style.display = 'none';
//===============================================
// DIV REPORT
var divReport=el('div',{
  style:{
    //position:'fixed'
  }
},
el('div',{textContent:''},[
  el('label',{textContent:'Name:'},el('input',{id:'namecontent',textContent:'None'})),
  el('br'),
  el('label',{textContent:'Type:'},el('input',{id:'typecontent',textContent:'Type'})),
  el('br'),
  el('label',{textContent:'App ID:'},el('input',{id:'appidcontent',textContent:'AppID'})),
  el('br'),
  el('label',{textContent:'Content:'},el('textarea',{id:'ticketcontent',textContent:'ticket'})),
])

);
mount(document.body, divReport);
divReport.style.display = 'none';
//===============================================
// TOGGLE STATUS
function toggleDivStatus(){
  divReport.style.display = 'none';
  divProgress.style.display = 'none';
  if(divStatus.style.display === 'none'){
    divStatus.style.display = 'block';
  }else{
    divStatus.style.display = 'none';
  }
  console.log('Toggle Status');
}
//===============================================
// TOGGLE PROGRESS
function toggleDivProgress(){
  divReport.style.display = 'none';
  divStatus.style.display = 'none';
  if(divProgress.style.display === 'none'){
    divProgress.style.display = 'block';
  }else{
    divProgress.style.display = 'none';
  }
}
//===============================================
// TOGGLE REPORT
function toggleDivReport(){
  divProgress.style.display = 'none';
  divStatus.style.display = 'none';
  if(divReport.style.display === 'none'){
    divReport.style.display = 'block';
  }else{
    divReport.style.display = 'none';
  }
}