const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
    return res.status(400).json({
    success: false,
    error: 'Errores de validación',
    details: errors.array().map(err => ({
        field: err.param || err.location,
        message: err.msg
    }))
    });
}
next();
};

module.exports = { handleValidationErrors };