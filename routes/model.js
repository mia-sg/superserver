const router = require('express').Router();
const { app } = require('../server.js');
const { PrismaClient } = require('@prisma/client');


/** Declare routes for Router */
router.post('/:model_name/retrive', async( req, res )=>{

    const db = new PrismaClient();

    /// Gt fields
    let select = {};
    if( req.body.fields ) {
        req.body.fields.forEach(_f => {
            select[ _f ] = true;
        });
    }else {
        Object.keys(db.users.fields).forEach(  _k =>{ select[_k] = true });
    }

    let modelName = req.params['model_name'];
    let data = [];
    if( db[ modelName ] ) {
        // db.users.findMany({
        //     select,
        //     where: ( req.body.where ) ?? {},
        //     skip: ( req.body.skip ) ?? 0,
        //     take: ( req.body.take ) ?? 50
        // });

        data = await db[ modelName].findMany({
            select,
            where: ( req.body.where ) ?? {},
            skip: ( req.body.skip ) ?? 0,
            take: ( req.body.take ) ?? 50
        })
    }
    res.json( { rows: data } );
});

router.post('/:model_name/create', async( req, res )=>{

    res.json({"message": "APi works"});
});

router.post('/:model_name/update', async( req, res )=>{

    res.json({"message": "APi works"});
});

router.post('/:model_name/destroy', async( req, res )=>{

    res.json({"message": "APi works"});
});


app.use( '/model', router );
