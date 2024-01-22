const { db } = require('./db.js');
const bcrypt = require('bcrypt');
const { v4 }  = require('uuid');
const { userWithToken, userWithLogin, setToken, updateToken, setLogin } = require('../db_queries/users.js');

let users = new Map();

async function getUserByToken( p_token )
{
    // Get from Map
    if( users.has( p_token ) ){
        return users.get( p_token );
    } else {
        // Get from DB
        let user = await userWithToken( p_token );

        if( user ) {
            users.set( p_token, user )
        } 
        return ( user ) ?? null;

    }
    

}

async function setUser( p_user )
{
    users.set( p_user.logins[0].tokens[0].token, p_user );
}


function hash( p_password )
{
    return new Promise(( resolve, reject )=>{
        bcrypt.hash(p_password, 10, function(err, hash) {
            if( err ) reject( err );
            else resolve( hash )
        });
    })
}

async function signIn( p_data )
{

    let user = await userWithLogin( p_data.login );
    if( !user ){
        throw new Error(" User does not exist! "); 
    }

    if( user.logins[0].tokens[0].expires_on < new Date() ) {
        
        let t = await updateToken( user.logins[0].tokens[0].id );
        user.logins[0].tokens[0] = t;
    }
    let result  = await bcrypt.compare( p_data.password, user.logins[0].password);
    if( result ){
        return user;
    } else {
        throw new Error(" Wrong password!");
    }
}

async function signUp( p_data )
{
    let _user = await db().users.findFirst({
        where: {
            logins:{
                some: {
                    login:{
                        equals: p_data.login
                    }
                }
            }
        }
    });
    if( _user ) {
        throw new Error(" User exists ");
    } else {
        let hashed_pass = await hash( p_data.password );

        let user = await db().users.create({
            data: {
                email: p_data.login,
                first_name: p_data.first_name ?? null,
                last_name: p_data.last_name ?? null
            }
        });

        let login = await setLogin( p_data.login, hashed_pass, user.id  );

        let token = await setToken( login.id );

        return { user, login, token };
    }
    
}

async function signOut()
{

}

async function resetPassword()
{

}


module.exports = {
    getUserByToken, signUp, signIn, setUser
}
