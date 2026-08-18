const { Router } = require('express');
const authController = require('../controllers/authController');
const passport = require('passport');
const { authenticateJWT } = require('../middleware/authMiddleware');

const { validateSignUpForm, validateLogInForm } = require('../middleware/validators/authValidators');
const { validateResult } = require('../middleware/validateResult');

const authRouter = Router();

authRouter.post('/sign-up', validateSignUpForm, validateResult, authController.postSignUpData);
authRouter.post('/login', validateLogInForm, validateResult, authController.postLoginData);

authRouter.post('/become-author', passport.authenticate('jwt',{session: false}), authController.upgradeToAuthor);

authRouter.get('/me', authenticateJWT, authController.getCurrentUser);


module.exports = authRouter;
