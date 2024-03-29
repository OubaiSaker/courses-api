const { body, validationResult } = require('express-validator')

const validationSchema = () => {
    return [
        body('title')
            .notEmpty()
            .withMessage("titlte is required")
            .isLength({ min: 2 })
            .withMessage("title must at least 2 digits"),
        body('price')
            .notEmpty()
            .withMessage("price is required")
    ]
}

module.exports = { validationSchema };