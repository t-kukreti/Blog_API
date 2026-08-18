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
};

const getUserByUsername = async(username) => {
    return prisma.user.findUnique({
        where: {
            username,
        }
    })
};

async function findUserById(id){
    return prisma.user.findUnique({
        where:{
            id,
        }
    })
};

async function updateUserById(id){
    return prisma.user.update({
        where: {
            id,
        },
        data: {
            isAuthor: true,
        }
    })
};



module.exports = {
    addUser,
    getUserByEmail,
    findUserById,
    updateUserById,
    getUserByUsername

}