/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

/**
  Blank template
 */
const { el, mount } = redom;

var divMenu=el("div",[
  el('a',{href:'/',textContent:'Home'}),
  el('button',{textContent:'Monitors'}),
  el('button',{textContent:'Members'}),
  
  el('button',{textContent:'Reports'}),
  el('button',{textContent:'Databases'}),
  
  el('button',{textContent:'Sites'}),
  el('button',{textContent:'Applications'}),
  el('button',{textContent:'Peer to peers'}),
  
  el('button',{textContent:'Configs'}),
  el('button',{textContent:'Settings'}),


  el('a',{href:'/logout',textContent:'Logout'}),
]);
mount(document.body, divMenu);
function clickBlank(){
  console.log('blank');
}

