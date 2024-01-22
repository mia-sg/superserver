const { exec } = require('child_process');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const { register } = require('./locals');


/// const __dirname = new URL(import.meta.url).pathname.slice(1) ;

const app = express();

let server = null;

/// Session 
app.set('trust proxy', 1) // trust first proxy

app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))


/// To get req.body
app.use(express.json())

/// Set statics
app.use('/static', express.static('./frontend/dist') );

// Set the template engine
app.use(expressLayouts);

app.set('layout', './frontend/shared/layouts/default' );

app.set('view engine', 'ejs');

app.set('views', `./frontend` );


function start( p_port, callback )
{
    const port  = p_port || 3000;
    server = app.listen(port, () => {

        if( typeof callback === "function" ) {
            callback( port );
        }
    })
}

function restart( callback )
{
    server.close(()=>{
        start( callback );
    })
}

function requireAllLocals()
{
    /// Find all js files inside tha locals folder
    // Then require them.
    let d = __dirname;

  
  let locals = path.join( __dirname, "locals" );

  const locals_files = fs.readdirSync( locals );

  if( locals_files ) {
    locals_files.forEach( _f=>{
          let f_name = _f.split('.')[0];
          register( f_name, require(`${locals}/${ f_name }`) );
      });
  }
}

function requireAllRoutes()
{
    /// Find all js files inside tha routes folder
    // Then require them.
    let d = __dirname;

  
  let routes = path.join( __dirname, "routes" );

  const routes_files = fs.readdirSync( routes );

  if( routes_files ) {
    routes_files.forEach( _f=>{
          let f_name = _f.split('.')[0];
          require(`${routes}/${ f_name }`)
      });
  }
}


module.exports =  {
    start,
    restart,
    requireAllRoutes, 
    requireAllLocals,
    app
}