/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

/**
  Blank template
 */
const { el, mount } = redom;

// FORM
var form_blank=el('form',{
  action:'/blank',
  method:'post'
  },
  el("table",[
    el("tr",[
      el("td", el("label",{textContent:"Action:"})),
      el("td", el("input",{name:'content',value:"test content"})),
      el("td", el("input",{type:"submit"})),
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

