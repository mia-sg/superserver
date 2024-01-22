const fs = require('fs');
const { start, app, requireAllLocals, requireAllRoutes } = require('./server.js');
const { view } = require('./view.js');
const { getUserByToken } = require('./services/auth.js');
const { getAll : allLocals } = require('./locals.js');
var cookieParser = require('cookie-parser')

/** Import all routes */
// require('./routes/api.js');
// require('./routes/auth.js');
// require('./routes/openai.js');
// require('./routes/model.js');
requireAllRoutes();


start( 3000, function( port ){
  console.log(` Server started on http://localhost:${port} `)
});

/// Set locals
requireAllLocals();


// Set locals
app.use(async ( req, res, next)=>{

  res.locals = allLocals();
  next();
})


/// Setup cookies
app.use(cookieParser())
app.use(async (req, res, next)=>{
  let u =( req.cookies.token ) ? await getUserByToken( req.cookies.token ) : null;
  if( u ) {
    req.app.locals.user = u;
  }
  else {
    req.cookies.token = null;
    res.clearCookie('token');
  }
  next();
})




/** All get routes which were not registred with requireAllRoutes functions will be considered as a route for an app. */
  app.get('/:param1?/:param2?/:param3?/:param4?', (req, res) => {
      let app_name = ( req.params.param1 ) ?? 'main';
      /// Get config file
      let config = {
        res: res,
        req: req
      };
      if( fs.existsSync( `./frontend/dist/apps/${app_name}/config.json` ) ) {
        let c = fs.readFileSync(`./frontend/dist/apps/${app_name}/config.json`, "utf8");
        config = JSON.parse( c );
      }
      else config = { layout: 'shared/layouts/default', access: "public" , exists: false};
      
      /// Pass req and res to ejs
      config.req = req;
      config.res = res;
      
      if( fs.existsSync( `./frontend/dist/apps/${app_name}/index.ejs` ) ) {
          config.app_name = app_name; config.title = 'test';
          if( config.access !== 'public' && !req.app.locals.user ) {
            res.cookie('redirect_to', app_name );
            res.redirect('/login');
          } else if ( req.app.locals.user && ['login', 'registration'].includes( app_name ) ) {
            res.redirect('/');
          }else{
            view( res, config);
          }
          
      }else {
        res.redirect('/notfound');
      }
    
  })
/** Not found page */
app.all('*', ( req, res )=>{
  res.json({"message":"Not found!"});
});


// Function to get all routes
// function getAllRoutes() {
//   const routes = [];
  
//   // Iterate through the middleware stack
//   app._router.stack.forEach((middleware) => {
//     if (middleware.route) {
//       // Routes registered directly on the app
//       routes.push(middleware.route);
//     } else if (middleware.name === 'router') {
//       // Routes registered on routers
//       middleware.handle.stack.forEach((handler) => {
//         const route = handler.route;
//         routes.push(route);
//       });
//     }
//   });

//   return routes;
// }

// // Get all routes and log them
// const allRoutes = getAllRoutes();



