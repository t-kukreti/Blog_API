const commentQueries = require('../db/commentQueries');

const getAllComments = async(req, res, next) => {
    try{
        const comments = await commentQueries.getAllComments(req.postId);
        const response = comments.map(comment => ({ 
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            authorId: comment.authorId,
            replyCount: comment._count.comments,
        }));
        res.json(response);

    }catch(err){
        return next(err);
    }
};

const getCommentReplies = async(req, res, next) => {
    try{
        const replies = await commentQueries.getReplies(Number(req.params.id));
        const response = replies.map((reply) => ({
            id: reply.id,
            content: reply.content,
            createdAt: reply.createdAt,
            authorId: reply.authorId,
            replyCount: reply._count.comments,
        }));
        res.json(response);
    }catch(err){
        return next(err);
    }
};

const postComment = async(req, res, next) => {};
const editComment = async(req, res, next) => {};
const deleteComment = async(req, res, next) => {};

module.exports = {
    getAllComments,
    postComment,
    editComment,
    deleteComment,
}