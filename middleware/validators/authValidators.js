const { body } = require('express-validator');
const { getUserByEmail, getUserByUsername } = require('../../db/authQueries');

const validateSignUpForm = [

    body('email')
    .trim()
    .notEmpty()
    .withMessage(`Email is required`)
    .bail()
    .isEmail()
    .withMessage(`Email should be valid`)
    .custom( async(value) => {
        const user = await getUserByEmail(value);
        if(user) {
            throw new Error("Email already in use");
        }
        return true;
    }),


    body('username')
    .trim()
    .notEmpty()
    .withMessage(`Username is required`)
    .bail()
    .isLength({min: 3, max: 30})
    .withMessage(`Username must be between 3 and 30 characters`)
    .custom(async(value) => {
        const user = await getUserByUsername(value);
        if(user){
            throw new Error('Username already in use');
        }
        return true;
    }),


    body('password')
    .notEmpty()
    .withMessage(`Password is required`)
    .bail()
    .isStrongPassword()
    .withMessage(`Choose a stronger password`),


    body('confirmPassword')
    .notEmpty()
    .withMessage(`Please confirm your password`)
    .bail()
    .custom((value, {req}) => value === req.body.password)
    .withMessage(`Passwords do not match`),

];

const validateLogInForm = [
    body('email')
    .trim()
    .notEmpty()
    .withMessage(`Email is required`)
    .bail()
    .isEmail()
    .withMessage(`Enter a valid Email`),

    body('password')
    .notEmpty()
    .withMessage(`Password is required`)

];

module.exports = {
    validateSignUpForm,
    validateLogInForm,
}