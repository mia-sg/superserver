
const router = require('express').Router();
const { app } = require('../server.js');

/** Declare routes for Router */
router.get('/js/core/:fil_path', async( req, res )=>{

    res.json({"message":` js core - ${ req.params.fil_path }` });
});

router.get('/js/:app_name/:fil_path', async( req, res )=>{

    res.json({"message":` js app_name - ${ req.params.app_name } - path ${ req.params.fil_path }` });
});

router.get('/css/core/:fil_path', async( req, res )=>{

    res.json({"message":` js - ${ req.params.fil_path }` });
});

router.get('/css/:app_name/:fil_path', async( req, res )=>{

    res.json({"message":` js - ${ req.params.fil_path }` });
});




app.use( '/static', router );