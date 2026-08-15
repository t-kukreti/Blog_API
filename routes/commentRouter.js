const {Router} = require('express');
const commentController = require('../controllers/commentController');
const { authenticateJWT, loadComment, isCommentOwner } = require('../middleware/authMiddleware');
const commentRouter = Router();

commentRouter.get('/posts/:id/comments', commentController.getAllComments);
commentRouter.get('/:id/replies', commentController.getCommentReplies);
commentRouter.post('/posts/:id/comments', authenticateJWT, commentController.postComment );
commentRouter.patch('/:id', authenticateJWT, loadComment, isCommentOwner, commentController.editComment);
commentRouter.delete('/:id', authenticateJWT, loadComment, isCommentOwner, commentController.deleteComment);

module.exports = commentRouter;