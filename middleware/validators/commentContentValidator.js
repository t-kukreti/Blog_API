const { body } = require('express-validator');

const validateCommentBody = [
    body('content')
    .trim()
    .notEmpty()
    .withMessage(`comment cannot be empty`)
    .bail()
    .isLength({max: 5000})
    .withMessage(`comment must not exceed 5000 characters`),

    body('parentCommentId')
    .optional({values: true})
    .isInt({min: 1})
    .toInt()
    .withMessage(`Invalid parent comment ID`)

];

const validateEditCommentBody = [
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Comment cannot be empty')
        .bail()
        .isLength({ max: 5000 })
        .withMessage('Comment must not exceed 5,000 characters'),
];

module.exports = {
    validateCommentBody,
    validateEditCommentBody
}