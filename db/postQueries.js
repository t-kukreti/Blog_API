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

const getAllPostByAuthor = async(authorId) => {
    return prisma.post.findMany({
        where: {
            authorId,
        }
    })
};

const createPost = async(data) => {
    return prisma.post.create({
        data,
    })
};

const updatePost = async(id, data) => {
    return prisma.post.update({
        where: {
            id,
        },
        data,
    })
};

const deletePost = async(id) => {
    return prisma.post.delete({
        where: {
            id,
        }
    })
};

const publishPost = async (id, currentStatus) => {
  return prisma.post.update({
    where: {
      id,
    },
    data: {
      published: !currentStatus,
    },
  });
};

module.exports = {
    getAllPublishedPosts,
    getPostById,
    getAllPostByAuthor,
    createPost,
    updatePost,
    deletePost,
    publishPost,
}