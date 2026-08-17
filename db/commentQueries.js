const prisma = require('../lib/prisma');

const getAllComments = async(postId) => {
    return prisma.comment.findMany({
        where: {
            postId,
            parentCommentId: null,
        },
        include: {
            author: {
                select: {
                    username: true,
                }
            },
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
        },
        include: {
            author: {
                select: {
                    username: true,
                }
            }
        }
    })
};

const getReplies = async(commentId) => {
    return prisma.comment.findMany({
        where: {
            parentCommentId: commentId,
        },
        include: {
            author: {
                select: {
                    username: true,
                }
            },
            _count: {
                select: {
                    comments: true,
                }
            }
        }
    });
};

const addComment = async(data) => {
    return prisma.comment.create({
        data,
        include: {
            author: {
                select: {
                    username: true,
                }
            }
        }
    });
};

const editComment = async(commentId, data) => {
    return prisma.comment.update({
        where: {
            id: commentId,
        },
        data,
    })
};

const softDeleteComment = async(commentId) => {
    return prisma.comment.update({
        where: {
            id: commentId,
        },
        data: {
            deleted: true,
        }
    })
};


module.exports = {
    getAllComments,
    getCommentById,
    addComment,
    editComment,
    softDeleteComment,
    getReplies
}