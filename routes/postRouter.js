const {Router} = require('express');
const postController = require('../controllers/postController');
const { optionalAuthenticateJwt, loadPost, canViewPost } = require('../middleware/authMiddleware');

const postRouter = Router();


postRouter.get('/', postController.getAllPost);
postRouter.get('/:id', optionalAuthenticateJwt, loadPost, canViewPost,  postController.getPostById);


module.exports = postRouter;