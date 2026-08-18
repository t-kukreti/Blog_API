const { body } = require('express-validator');

const validatePostBody = [
    body('title')
    .trim()
    .notEmpty()
    .withMessage(`Title is required`)
    .bail()
    .isLength({min: 3, max: 255})
    .withMessage(`Title must not exceed 255 characters and should be minimum 3 characters`),

    body('content')
    .trim()
    .notEmpty()
    .withMessage(`Content is required`)
    .bail()
    .isLength({max: 50000})
    .withMessage(`Content must not exceed 50,000 characters`)

];

module.exports = {
    validatePostBody,
}