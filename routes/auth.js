const router = require('express').Router();
const { app } = require('../server.js');
const { setUser, signIn, signUp } = require('../services/auth.js');

/** Declare routes for Router */
router.post('/sign-in', async( req, res )=>{

    if( !req.body || !req.body.login || !req.body.password ) {
        res.json({"message": "Missing info"});
    }else{
        try{
            let user  = await signIn( req.body ); 
    
            if( user ) {
                setUser( user );
                res.cookie('token', user.logins[0].tokens[0].token, {
                    httpOnly: true, 
                    expires: user.logins[0].tokens[0].expires_on
                });

                let r = {"message": "Success", "code": 1 };
                res.json( r );
            }
            
    
        }catch( err ){
            res.json({"message": "Error while logged in", "error": err.message });
        }
    }
    
    
});

router.post('/sign-up', async( req, res )=>{
    if( !req.body || !req.body.login || !req.body.password  ){
        res.json({"message": "Misiing info!!", "code": 3 });
    }else {
        try {
            let result = await signUp(req.body);
            req.session.token = result.token.token;
    
            res.json({"message": "Signed up!", "code": 1 });
        } catch (error) {
            res.json({"message": "Error!", "error ": error, "code": 4 });
        }
    }
    
    
});

router.post('/sign-out', async( req, res )=>{

    res.json({"message": "APi works"});
});

router.post('/reset-password', async( req, res )=>{

    res.json({"message": "APi works"});
});


app.use( '/auth', router );
