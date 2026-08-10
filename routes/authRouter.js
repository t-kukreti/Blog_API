const {Router} = require('express');
const authController = require('../controllers/authController');
const passport = require('passport');

const authRouter = Router();

authRouter.post('/sign-up', authController.postSignUpData);
authRouter.post('/login', authController.postLoginData);

authRouter.get('/test', passport.authenticate('jwt',{session:false}),  authController.testJwt);


module.exports = authRouter;