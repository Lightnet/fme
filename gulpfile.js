/**
  LICENSE: MIT
  Created By: Lightnet
 */

// GULP FUNCTIONS
const { src, dest, watch, parallel, series } = require("gulp");
// const sync = require("browser-sync").create();
const nodemon = require('gulp-nodemon');
const config = require('./config');

const src_client_files=[
  './src/client/client_access.js'
  ,'./src/client/client_index.js'
  ,'./src/client/client_chat.js'
  ,'./src/client/client_message.js'
  ,'./src/client/client_gethint.js'
  ,'./src/client/client_account.js'
  ,'./src/client/client_login.js'
  ,'./src/client/client_signup.js'
  //,'./src/client/client_mod.js'
  //,'./src/client/client_admin.js'
  //,'./src/client/client_ticket.js'
];
const src_html_files=[
  './src/html/access_page.html'
  //,'./src/html/theme.html'
  //,'./src/html/icons.html'
];

const src_svg_files=[
  './src/assets/svg/*.svg'
];

const src_hbs_files=[
  './src/server/fastify/views/*.hbs'
];

const src_css_files=[
  './src/assets/css/style.css'
];

const output_dest = 'public';

// CLIENT BUILD
function client_build(callback){
  return src(src_client_files)
    .pipe(dest(output_dest));
}
exports.client_build = client_build;

// COPY HTML
function copy_html(callback){
  return src(src_html_files)
    .pipe(dest(output_dest));
}
exports.copy_html = copy_html;

// COPY SVG
function copy_svg(callback){
  return src(src_svg_files)
    .pipe(dest(output_dest));
}
exports.copy_svg = copy_svg;

function copy_css(callback){
  return src(src_css_files)
    .pipe(dest(output_dest));
}
exports.copy_css = copy_css;

// WATCH FILES
function watchFiles(callback) {

  watch(src_client_files, client_build);

  //watch(src_html_files, copy_html);
  watch(src_css_files, copy_css);
  watch(src_hbs_files, (callback)=>{
    return callback();
  });

  callback();
}
exports.watch = watchFiles;

// NODEMON
function reload_server(done) {
  nodemon({
    //script: 'index.js'
    script: 'app.js'
    //, ext: 'js html'
    , ext: 'js hbs'
    , env: { 
    'NODE_ENV': 'development' // ex. process.env.NODE_ENV
    ,'PORT': config.port || 3000
    ,'HOST': config.host || 'localhost'
    ,'SECRET': config.secretKey || '1234567890123456789012345678901234567890'
    ,'TOKEN': config.tokenKey || 'token'
  }
  ,ignore: [
    'gulpfile.js'
    ,'node_modules/'
    ,'public/'
  ]
  , done: done
  })
}
exports.reload_server = reload_server;

//DATABASE
function reload_database(done) {
  nodemon({
    script: 'database.js'
    , ext: 'js'
    , env: { 
    'NODE_ENV': 'development' // ex. process.env.NODE_ENV
    ,'PORT': config.port || 3000
    ,'HOST': config.host || 'localhost'
    ,'SECRET': config.secretKey || '1234567890123456789012345678901234567890' //required 32 char
    ,'TOKEN': config.tokenKey || 'token'
  }
  ,ignore: [
    'gulpfile.js'
    ,'node_modules/'
    ,'public/'
  ]
  , done: done
  })
}
exports.reload_database = reload_database;

// GULP DEFAULT CONFIGS
exports.default = series(
  client_build
  //, copy_html
  , copy_css
  , watchFiles
  , reload_server
);
//cmd: gulp default 



