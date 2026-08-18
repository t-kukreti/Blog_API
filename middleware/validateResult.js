const { validationResult } = require('express-validator');

const validateResult = (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            const fields = {};

            errors.array().forEach(error => {
                fields[error.path] = error.msg;
            });

            return res.status(400).json({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Invalid request',
                    fields
                }
            })
        }
        return next();
};

module.exports = {
    validateResult,
}