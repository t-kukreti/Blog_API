const postQueries = require('../db/postQueries');
const { post } = require('../lib/prisma');

const getAllPost = async (req, res, next) => {
    try{
        const posts = await postQueries.getAllPublishedPosts();   
        res.json(posts);
    }catch(err){
        return next(err);
    }
};

const getPostById = (req, res, next) => {
    try{
        const post = req.post;
        res.json({
            post: {
            id: post.id,
            title: post.title,
            content: post.content,
            published: post.published
        }
        });
    }catch(err){
        return next(err);
    }
};

const getAllPostByAuthor = async(req, res, next) => {
    try{
        const posts = await postQueries.getAllPostByAuthor(req.user.id);
        if(! posts.length){
            return res.json([]);
        }
        res.json(posts);

    }catch(err){
        return next(err);
    }
};

const createPostByAuthor = async(req, res, next) => {
    try{

        // add validation later.
        const authorId = req.user.id;
        const {title, content} = req.body;

        const post = await postQueries.createPost({
            title,
        content,
        authorId,
    });

    res.status(201).json({
        message: "Created a post successfully",
        post: {
            id: post.id,
            title: post.title,
            content: post.content,
            published: post.published
        }
    });
}catch(err){
    return next(err);
}

};

const editPostByAuthor = async(req, res, next) => {
    try{    
        // add validation here.
        const { title, content} = req.body;
        const postId = req.post.id;

        const updatedPost = await postQueries.updatePost(postId,{
            title,
            content,
        });

        res.status(200).json({
            message: "Post updated successfully",
            Post: {
                id: updatedPost.id,
                title: updatedPost.title,
                content: updatedPost.content,
                published: updatedPost.published
            }
        })

    }catch(err){
        return next(err);
    }
};

const deletePostByAuthor = async(req, res, next) => {
    try{    
        const deletedPost = await postQueries.deletePost(req.post.id);
        if(!deletedPost){
            res.json({message: "couldn't find post to delete"});
        }
        res.status(204).json({
            message: "post deleted successfully",
            post: {
                deletedPost,
            }
        });
    }catch(err){
        return next(err);
    }
};

const publishPostByAuthor = async(req, res, next) => {
    try{
        const publishedPost = await postQueries.publishPost(req.post.id);
        res.status(200).json({
            message: "Post published successfully",
            Post: {
                id: publishedPost.id,
                title: publishedPost.title,
                content: publishedPost.content,
                published: publishedPost.published
            }
        })
    }catch(err){
        return next(err);
    }
};


module.exports = {
    getAllPost,
    getPostById,
    getAllPostByAuthor,
    createPostByAuthor,
    editPostByAuthor,
    deletePostByAuthor,
    publishPostByAuthor,
}