const {Router} = require('express');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const { optionalAuthenticateJwt, loadPost, canViewPost, authenticateJWT, isAuthor, isOwner } = require('../middleware/authMiddleware');

const { validatePostBody } = require('../middleware/validators/postContentValidators');
const { validateResult } = require('../middleware/validateResult');

const { validateCommentBody } = require('../middleware/validators/commentContentValidator');

const postRouter = Router();


// static routes
postRouter.get('/', postController.getAllPost);
postRouter.get('/mine', authenticateJWT, isAuthor, postController.getAllPostByAuthor);

// nested comment routes
postRouter.get('/:postId/comments', commentController.getAllComments);
postRouter.post('/:postId/comments', authenticateJWT, validateCommentBody, validateResult, commentController.postComment);

// dynamic routes (static always goes first)
postRouter.get('/:id', optionalAuthenticateJwt, loadPost, canViewPost,  postController.getPostById);
postRouter.post('/', authenticateJWT, isAuthor, validatePostBody, validateResult, postController.createPostByAuthor);

postRouter.patch('/:id/publish', authenticateJWT, isAuthor, loadPost, isOwner, postController.publishPostByAuthor);

postRouter.patch('/:id', authenticateJWT, isAuthor, loadPost, isOwner, validatePostBody, validateResult, postController.editPostByAuthor);
postRouter.delete('/:id', authenticateJWT, isAuthor, loadPost, isOwner, postController.deletePostByAuthor);




module.exports = postRouter;