const router = require('express').Router();
const { app } = require('../server.js');
require('dotenv').config();

/** Declare routes for Router */

let secret_key = process.env.API_KEY;

router.post('/send', async( req, res )=>{

    let data = await fetch('https://api.openai.com/v1/chat/completions',{
        method:"POST",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${secret_key} `,
            "OpenAI-Organization": "org-rGa9HGY5H62K7aAJoBZLfXHi"
        },
        body:JSON.stringify({
            model: "gpt-3.5-turbo",
            message: [{ role: "user", conent: "Say this is a test"}],
            temperature: 0.7
        })
    }).then( res=> res.json() );

    res.json({"data": data });
});


app.use( '/openai', router );
