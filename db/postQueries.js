const prisma = require('../lib/prisma');

const getAllPublishedPosts = async() => {
    return prisma.post.findMany({
        where: {
            published: true,
        }
    });
};

const getPostById = async(id) => {
    return prisma.post.findUnique({
        where:{
            id,
        }
    })
};

module.exports = {
    getAllPublishedPosts,
    getPostById,
}