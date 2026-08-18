const postQueries = require('../db/postQueries');
const { matchedData } = require('express-validator');

//TODO: responses standardization 

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
        const authorId = req.user.id;
        const {title, content} = matchedData(req);

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
        const { title, content} = matchedData(req);
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
        await postQueries.deletePost(req.post.id);
        return res.status(204).send();
    }catch(err){
        return next(err);
    }
};

const publishPostByAuthor = async (req, res, next) => {
  try {
    const updatedPost = await postQueries.publishPost(
      req.post.id,
      req.post.published
    );

    return res.status(200).json({
      message: updatedPost.published
        ? "Post published successfully"
        : "Post unpublished successfully",

      Post: {
        id: updatedPost.id,
        title: updatedPost.title,
        content: updatedPost.content,
        published: updatedPost.published,
      },
    });
  } catch (err) {
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