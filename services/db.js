const { PrismaClient }  = require('@prisma/client');

const prisma = new PrismaClient();

function db()
{
    return new PrismaClient();
}

module.exports =  {
    db
}