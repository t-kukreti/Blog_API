const prisma = require('../lib/prisma');

async function addUser(data){
   return prisma.user.create({
        data,
    });
};

async function getUserByEmail(email){
    return prisma.user.findUnique({
        where:{
            email,
        }
    });

}
async function findUserById(id){
    return prisma.user.findUnique({
        where:{
            id,
        }
    })
}

module.exports = {
    addUser,
    getUserByEmail,
    findUserById,

}