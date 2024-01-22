const { PrismaClient } = require('@prisma/client');

async function userWithToken ( p_token )
{
    const db = new PrismaClient();
    let user = await db.users.findFirst({
        select:{
            first_name: true,
            last_name: true,
            id: true,
            email: true,
            logins:{
                select:{
                    password: true,
                    login:true,
                    tokens:{
                        select:{
                            id: true,
                            token: true,
                            expires_on: true
                        }
                    }
                }
            }
        },
        where:{
            logins:{
                some:{
                    tokens:{
                        some:{
                            expires_on:{
                                gt: new Date()
                            },
                            token:{
                                equals: p_token
                            }
                        }
                    }
                }
            }
        }
    })

    db.$disconnect();

    return user;
}

async function userWithLogin( p_login )
{
    const db = new PrismaClient();
    let user = await db.users.findFirst({
        select:{
            first_name: true,
            last_name: true,
            id: true,
            email: true,
            logins:{
                select:{
                    password: true,
                    login:true,
                    tokens:{
                        select:{
                            id:true,
                            token: true,
                            expires_on: true
                        }
                    }
                }
                
            }
        },
        where:{
            logins:{
                some:{
                    login:{
                        equals:p_login
                    }
                }
            }
        }
    });

    db.$disconnect();
    return user;
}

async function setLogin( p_login, hashed_pass, user_id )
{
    const db = new PrismaClient();

    let login = await db.logins.create({
        data: {
            login: p_login,
            password: hashed_pass,
            user_id: user_id
        }
    });

    db.$disconnect();

    return login;
}

async function updateToken( token_id )
{
    const db = new PrismaClient();

    let token = await db.tokens.update({
        where:{
            id: token_id
        },
        data: {
            expires_on: new Date(Date.now() + ( 1000 * 60 * 60 * 24  ) )
        }
    });

    db.$disconnect();

    return token;
}

async function setToken( login_id )
{
    const db = new PrismaClient();
    let token = await db.tokens.create({
        data: {
            token: v4(),
            login_id: login_id,
            expires_on: new Date(Date.now() + ( 1000 * 60 * 60 * 24  ) )
        }
    });
    db.$disconnect();

    return token;
}

async function allUsers()
{
    const db = new PrismaClient();
    let users =  await db.users.findMany({});
    db.$disconnect();
    return users;
}

module.exports = {
    userWithToken, allUsers, userWithLogin, updateToken, setToken, setLogin
};