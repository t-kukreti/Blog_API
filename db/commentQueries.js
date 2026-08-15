const prisma = require('../lib/prisma');

const getAllComments = async(postId) => {
    return prisma.comment.findMany({
        where: {
            postId,
            parentCommentId: null,
        },
        include: {
            _count: {
                select: {
                    comments: true,
                }
            }
        }
    });
};

const getCommentById = async(id) => {
    return prisma.comment.findUnique({
        where: {
            id,
        }
    })
};

const getReplies = async(commentId) => {
    return prisma.comment.findMany({
        where: {
            parentCommentId: commentId,
        },
        include: {
            _count: {
                select: {
                    comments: true,
                }
            }
        }
    });
};

const addComment = async(req, res, next) => {
    try{

    }catch(err){
        
    }
};
const editCommentById = async() => {};
const deleteCommentById = async() => {};


module.exports = {
    getAllComments,
    getCommentById,
    addComment,
    editCommentById,
    deleteCommentById,
    getReplies
}