const {Router} = require('express');
const postController = require('../controllers/postController');
const { optionalAuthenticateJwt, loadPost, canViewPost, authenticateJWT, isAuthor, isOwner } = require('../middleware/authMiddleware');

const postRouter = Router();


// static routes
postRouter.get('/', postController.getAllPost);
postRouter.get('/mine', authenticateJWT, isAuthor, postController.getAllPostByAuthor);

// dynamic routes (static always goes first)

postRouter.get('/:id', optionalAuthenticateJwt, loadPost, canViewPost,  postController.getPostById);
postRouter.post('/', authenticateJWT, isAuthor, postController.createPostByAuthor);
postRouter.patch('/:id/publish', authenticateJWT, isAuthor, loadPost, isOwner, postController.publishPostByAuthor);
postRouter.patch('/:id', authenticateJWT, isAuthor, loadPost, isOwner, postController.editPostByAuthor);
postRouter.delete('/:id', authenticateJWT, isAuthor, loadPost, isOwner, postController.deletePostByAuthor);


module.exports = postRouter;