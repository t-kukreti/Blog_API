const commentQueries = require('../db/commentQueries');

const getAllComments = async(req, res, next) => {
    try{
        const comments = await commentQueries.getAllComments(Number(req.params.postId));
        const response = comments.map(comment => ({ 
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt,
            authorId: comment.authorId,
            replyCount: comment._count.comments,
            deleted: comment.deleted,
            username: comment.author.username,
        }));
        res.json(response);

    }catch(err){
        return next(err);
    }
};

const getCommentReplies = async(req, res, next) => {
    try{
        const replies = await commentQueries.getReplies(Number(req.params.commentId));
        const response = replies.map((reply) => ({
            id: reply.id,
            content: reply.content,
            createdAt: reply.createdAt,
            updatedAt: reply.updatedAt,
            authorId: reply.authorId,
            replyCount: reply._count.comments,
            deleted: reply.deleted,
            username: reply.author.username,
        }));
        res.json(response);
    }catch(err){
        return next(err);
    }
};

const postComment = async(req, res, next) => {
    try{
        const { content, parentCommentId } = req.body;
        const parentId = parentCommentId ?? null;
        const postId = Number(req.params.postId);
        const authorId = req.user.id;

        if( parentId !== null ){
            const parentComment = await commentQueries.getCommentById(Number(parentId));

            if(! parentComment){
                return res.status(404).json({
                    message: "parent comment not found",
                })
            }

            if( parentComment.postId !== postId ){
                return res.status(400).json({
                    message: "You cannot reply to this comment from another post",
                });
            }
        }

        const postedComment = await commentQueries.addComment({
            content,
            authorId,
            postId,
            parentCommentId: parentId,
        });

        return res.status(201).json({
            message: "comment created successfully",
            postedComment: {
                id: postedComment.id,
                content: postedComment.content,
                createdAt: postedComment.createdAt,
                updatedAt: postedComment.updatedAt,
                authorId: postedComment.authorId,
                parentCommentId: postedComment.parentCommentId,
                replyCount: 0,
                username: postedComment.author.username,
            }
        });

    }catch(err){
        return next(err);
    }
};


const editComment = async(req, res, next) => {
    try{
        const {content} = req.body;
        const commentId = req.comment.id;

        const updatedComment = await commentQueries.editComment(commentId, {
            content,
        });

        res.status(200).json({
            message: "comment edited successfully",
            updatedComment: {
                id: updatedComment.id,
                content: updatedComment.content,
                parentId: updatedComment.parentCommentId,
                updatedAt: updatedComment.updatedAt,
            }
        })

    }catch(err){
        return next(err);
    }
};

const softDeleteComment = async(req, res, next) => {
    try{
        const commentId = req.comment.id;
        const deletedComment = await commentQueries.softDeleteComment(commentId);
        res.status(200).json({
            message: "comment deletd successfully",
            deletedComment: {
                id: deletedComment.id,
                deleted: deletedComment.deleted,
                parentId: deletedComment.parentCommentId,
            }
        })
    }catch(err){
        return next(err);
    }
};

module.exports = {
    getAllComments,
    postComment,
    editComment,
    softDeleteComment,
    getCommentReplies,
}