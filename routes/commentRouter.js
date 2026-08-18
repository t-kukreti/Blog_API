const {Router} = require('express');
const commentController = require('../controllers/commentController');
const { authenticateJWT, loadComment, isCommentOwner, isCommentDeleted } = require('../middleware/authMiddleware');

const { validateEditCommentBody } = require('../middleware/validators/commentContentValidator');
const { validateResult } = require('../middleware/validateResult');

const commentRouter = Router();


commentRouter.get('/:commentId/replies', commentController.getCommentReplies);

commentRouter.patch('/:commentId', authenticateJWT, loadComment, isCommentDeleted, isCommentOwner, validateEditCommentBody, validateResult, commentController.editComment);
commentRouter.delete('/:commentId', authenticateJWT, loadComment, isCommentDeleted, isCommentOwner, commentController.softDeleteComment);

module.exports = commentRouter;