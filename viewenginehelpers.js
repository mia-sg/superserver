// const { app } = require('./server.js');
// const fs = require('fs');
// const path = require('path');

// function getAppCss( app_name )
// {
//     let r = ``;
//     let view_css = `frontedn/dist/apps/${ app_name }/index.css`;


//     if( fs.existsSync( view_css ) ){
//         r = `<link rel="stylesheet" href="/static/apps/${ app_name }/index.css">`;
//     }

//     return r;
// }

// function getAppJs( app_name, p_module = false )
// {
//     let r = ``;
//     let view_js = `frontend/dist/apps/${app_name}/main.js`; // path.join( path.dirname( __dirname ), `frontedn/dist/${ app_name }/index.js` ) ;
    

//     if( fs.existsSync( view_js ) ){
//         r = `<script type="${ (p_module) ? 'module' : 'text/javascript' }"  src="/static/apps/${app_name}/main.js" ></script>`;
//     }
//     return r;
// }

// function initAppDs( app_name )
// {
//     let r = '';
//     let dir = `./frontend/source/apps/${ app_name }/ds`;
//     if( fs.existsSync( dir ) ) {
//         let files = fs.readdirSync( dir );
//         if( files ) {
//             r += '<script>';
//             files.forEach((_f)=>{
//                 let config = require(`../frontend/source/apps/${ app_name }/ds/${ _f }`);
//                 r += `window.container.createDS(${ JSON.stringify(config) });`;
//             });

//             r += '</script>';
//         }
//     }
    

//     return r;
// }

// function layout( p_layout)
// {
//     app.set('layout', path.join(path.dirname(__dirname), `frontend/shared/layouts/${p_layout}`) );
// }

// module.exports =  {
//     getAppCss, getAppJs, layout
// }