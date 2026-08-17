const passport = require('passport');
const {getPostById: findPostById} = require('../db/postQueries');
const {getCommentById: findCommentById} = require('../db/commentQueries');

const authenticateJWT = passport.authenticate('jwt', {session: false});

const optionalAuthenticateJwt = (req, res, next) => {
    if(!req.headers.authorization){
        return next();
    }
    passport.authenticate('jwt', {session: true}, (err, user)=>{
        if(err){
            return next(err);
        }
        if(user){
            req.user = user;
        }
        next();
    })(req,res,next);
};

const canViewPost = (req, res, next) => {
    // published posts can be viewed by anyone
    if(req.post.published){
        return next();
    }

    // draft -> owner only 
    if(req.user && req.user.id === req.post.authorId){
        return next();
    }

    return res.status(404).json({
        message: "Post not found"
    });

};

const isAuthor = (req, res, next) => {
    if(!(req.user.isAuthor)){
        return res.status(403).json({
            message: "Author access required"
        });        
    }
    return next();
};

const loadPost = async(req, res, next) => {
    try{
        const post = await findPostById(Number(req.params.id));
        if(!post){
            return res.status(404).json({
                message: "No post is there"
            })
        }
        req.post = post;
        return next()
    }catch(err){
        return next(err);
    }
}

const isOwner = (req, res, next) => {
    if(req.user.id !== req.post.authorId){
        return res.status(403).json({
            message: "Youre not the author of this post"
        })
    }
return next();
};

const loadComment = async(req, res, next) => {
    try{
        const comment = await findCommentById(Number(req.params.id));
        
        if(! comment){
            return res.status(404).json({
                message: "No such comment exists",
            })
        }
        req.comment = comment;
        return next();
    }catch(err){
        return next(err);
    }
};

const isCommentOwner = (req, res, next) => {
    if(req.user.id !== req.comment.authorId){
        return res.status(403).json({
            message: "You re not the owner of this comment",
        })
    }
    return next();
};

const isCommentDeleted = (req, res, next) => {
    if(req.comment.deleted){
        return res.status(403).json({
            message: "Comment is already deleted"
        })
    }
    return next();
};


module.exports = {
    authenticateJWT,
    isAuthor,
    loadPost,
    isOwner,
    optionalAuthenticateJwt,
    canViewPost,
    loadComment,
    isCommentOwner,
    isCommentDeleted,
}