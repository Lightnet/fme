/**
 * Created By: Lightnet
 * LICENSE: MIT
 */

const { el, mount,unmount } = redom;
//console.log(document.cookie);
//let myStorage = window.localStorage;
let isPostClose=false;
//myStorage.setItem('ispostclose', false);
//console.log(localStorage.getItem('isPostClose'))
if(localStorage.getItem('isPostClose') ==null){
  localStorage.setItem('isPostClose', false);
}else{
  isPostClose = (localStorage.getItem('isPostClose') == 'true' );
  //isPostClose = (isPostClose == 'true')
}
//console.log(isPostClose);
//===============================================
// CREATE BLOG
var divCreateBlog=el("div",{
  style:{
    position:'fixed',
    top:'32px'
  }
},
el("table",[
  el("tr",[
    el("td", el("label","Create Blog?")),
    el("td", el("input",{type:"submit",onclick:aliasCreatePubId})),
  ])
])
);
//mount(document.body, divCreateBlog);
//===============================================
// PUBLIC ID POST
var divPost=el('div',{
    style:{
      position:'fixed'
    , top:'32px'
    }
  },
  [
    el("label",'POST CONTENT?'),
    el('table',[
      el('tr',el('td', el('textarea',{id:'aliascontent',value:'testcontent'}))),
      el('tr',el('td', el('button',{onclick:aliasPostContent, textContent:'Post'}))) ,
      el('tr',el('td', el('label',{ textContent:'Close at Post' }, el('input',{type:'checkbox',checked:isPostClose ,id:'isClosePost', value:true, onclick:btnCheckPostClose})) ))
    ])
]);
function btnCheckPostClose(){
  //console.log(document.getElementById('isClosePost').value);
  //console.log(isPostClose);
  if(isPostClose){
    isPostClose=false;
    localStorage.setItem('isPostClose', false);
  }else{
    isPostClose=true;
    localStorage.setItem('isPostClose', true);
  }
  //console.log(isPostClose);
  //console.log(localStorage.getItem('isPostClose'));
}
//===============================================
// SEARCH
var divSearch=el('div',{
  style:{
    position:'fixed'
    , top:'32px'
  }
},[
  //el('label','Pub Id:'),
  el('input',{placeholder:'public Id'}),
  el('button',{onclick:SearchPubId,textContent:'Search'})
]);
mount(document.body, divSearch);
divSearch.style.display = 'none';
function SearchPubId(){
  
}
//===============================================
// SETTINGS
var divSettings=el('div',{
  style:{
    position:'fixed'
    , top:'32px'
  }
},[
  el('label','Settings:'),
  el('button',{onclick:toggleTheme,textContent:'Toggle Theme'})
]);
mount(document.body, divSettings);
divSettings.style.display = 'none';
function toggleTheme(){
  console.log('toggle theme');
}
//===============================================
// FEED
var divFeedContent=el('div',{id:'feeds'});
var divFeeds=el('div',{id:'feedsection',textContent:'FEEDS',
style:{
  position:'fixed'
  , top:0
  , left:'50%'
}
}, divFeedContent);
//===============================================
// MENU
var divMenu=el('div',{
  style:{
    position:'fixed'
    , top:0
    , left:0
  }
},[
  el('a',{href:'/',textContent:'Home'}),
  el('button',{onclick:togglePost,textContent:'Post'}),
  el('button',{onclick:toggleSearch,textContent:'Search'}),
  el('button',{onclick:toggleSettings,textContent:'Settings'}),
]);
mount(document.body, divMenu);

function togglePost(){
  console.log(divPost.style.display);
  divSearch.style.display = 'none';
  divSettings.style.display = 'none';
  if(divPost.style.display === 'none'){
    divPost.style.display = 'block';
  }else{
    divPost.style.display = 'none';
  }
}
function toggleSearch(){
  console.log(divSearch.style.display);
  divPost.style.display = 'none';
  divSettings.style.display = 'none';
  if(divSearch.style.display === 'none'){
    divSearch.style.display = 'block';
  }else{
    divSearch.style.display = 'none';
  }
}
function toggleSettings(){
  console.log(divSettings.style.display);
  divSearch.style.display = 'none';
  divPost.style.display = 'none';
  if(divSettings.style.display === 'none'){
    divSettings.style.display = 'block';
  }else{
    divSettings.style.display = 'none';
  }
}

function checkAliasExist(){
  fetch('/alias/checkPubIdExist',{

  })
  .then(response => response.json())
  .then((respone) => {
    console.log(respone);
    if(respone.message=='NONEXIST'){
      mount(document.body, divCreateBlog);
    }
    if(respone.message=='EXIST'){
      mount(document.body, divPost);
      mount(document.body, divFeeds);
      //get current alias public posts
      aliasGetPubIdPosts();
    }
  });
}
checkAliasExist();

function aliasCreatePubId(){
  fetch('/alias/createPublicId',{

  })
  .then(response => response.json())
  .then((respone) => {
    console.log(respone);
    if(respone.message=='CREATE'){
      unmount(document.body, divCreateBlog);
      mount(document.body, divPost);
    }
  });
}
// POST CONTENT
function aliasPostContent(){
  console.log('isPostClose:',isPostClose);
  if(isPostClose){
    if(divPost.style.display === 'none'){
      divPost.style.display = 'block';
    }else{
      divPost.style.display = 'none';
    }
  }
  let post = {
    aliascontent: document.getElementById('aliascontent').value || '',
  };
  fetch('/alias/post',{
    method: "post"
    , body: JSON.stringify(post)
  })
  .then(response => response.json())
  .then((respone) => {
    console.log(respone);
    if(respone.message=='CREATE'){
      //console.log(label_post);
      console.log('PASS POST');
      appendFeed(respone.post)
    }
  });
}
//GET PUBLIC POSTS
function aliasGetPubIdPosts(){
  let post = {
    //aliascontent: document.getElementById('aliascontent').value || '',
  };
  fetch('/alias/getPubIdPosts',{
    method: "post"
    //, body: JSON.stringify(post)
  })
  .then(response => response.json())
  .then((respone) => {
    console.log(respone);
    if(respone.message=='FOUND'){
      for(let k in respone.feeds){
        //console.log(respone.feeds[k]);
        appendFeed(respone.feeds[k]);
        //let divfeed =el('div',{id:respone.feeds[k].id,textContent:respone.feeds[k].content})
        //mount(divFeeds, divfeed);
      }
    }
  });
}

function timedateclock(time){
  //return new Date(time);
  let plus0 = num => `0${num.toString()}`.slice(-2);
  let d = new Date(time);
  let year = d.getFullYear();
  let monthTmp = d.getMonth() + 1;
  let month = plus0(monthTmp);
  let date = plus0(d.getDate());
  //let hour = plus0(d.getHours()%12);
  let hour = plus0(d.getHours()%12);
  let minute = plus0(d.getMinutes());
  let second = plus0(d.getSeconds());
  let rest = time.toString().slice(-5);

  //return `${year}-${month}-${date}_${hour}:${minute}:${second}.${rest}`;
  return `${year}-${month}-${date}_${hour}:${minute}:${second}`;
}

function appendFeed(feed){
  let time = timedateclock(parseInt(feed.id));
  //console.log(time);

  let divfeed =el('div',{id:feed.id,textContent:feed.content},[
    el('div',[
      el('label',{textContent:time}),
      el('button',{onclick:()=>{togglePostId(feed.id);},textContent:'action'})
    ])
  ]);
  //mount(divFeedContent, divfeed);
  divFeedContent.prepend(divfeed);
  function togglePostId(id){
    console.log(id);
  }
}