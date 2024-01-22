const mix = require('laravel-mix');
const path = require('path');

let viewName = process.env.npm_config_view_name;
let appName = process.env.npm_config_app_name;
let isCore = process.env.npm_config_core;

mix.webpackConfig({
  module:{
    rules:[
      {
        test:/\.html$/,
        loader:'html-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  }
});

mix.alias({
  '~core': path.join(__dirname, 'frontend/core/src')
});

if( appName  ){
  mix.js( `frontend/dist/apps/${appName}/src/index.js` , `frontend/dist/apps/${appName}/main.js`)
  .sass( `frontend/dist/apps/${appName}/src/index.scss`, `frontend/dist/apps/${appName}/main.css` );
}

if( isCore ) {
  mix.js( `frontend/core/src/index.js` , `frontend/dist/core/core.js`)
  .sass( `frontend/core/src/index.scss`, `frontend/dist/core/core.css` );
}

// if( !viewName && appName ) {
//   mix.js( `apps/${appName}/frontend/js/index.js` , `public/${appName}`)
//   .sass( `apps/${appName}/frontend/index.scss`, `public/${appName}` );
// }

// if( !viewName && !appName ){
//   mix.js( `core/frontend/index.js` , `public/core`)
//   .sass( `core/frontend/index.scss`, `public/core` );
// }
