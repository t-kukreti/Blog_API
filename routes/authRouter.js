const {Router} = require('express');
const authController = require('../controllers/authController');
const passport = require('passport');
const { authenticateJWT } = require('../middleware/authMiddleware');

const authRouter = Router();

authRouter.post('/sign-up', authController.postSignUpData);
authRouter.post('/login', authController.postLoginData);

authRouter.post('/become-author', passport.authenticate('jwt',{session: false}), authController.upgradeToAuthor);

authRouter.get('/me', authenticateJWT, authController.getCurrentUser);


module.exports = authRouter;
