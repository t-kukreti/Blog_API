const postQueries = require('../db/postQueries');

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
        res.json(post);
    }catch(err){
        return next(err);
    }
};


module.exports = {
    getAllPost,
    getPostById,
}