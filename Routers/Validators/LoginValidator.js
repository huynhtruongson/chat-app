const {check} = require('express-validator')

module.exports = [
    check('email')
    .exists().withMessage('Vui lòng cung cấp tên email')
    .notEmpty().withMessage('Vui lòng không để tên email'),

    check('password')
    .exists().withMessage('Vui lòng cung cấp mật khẩu')
    .notEmpty().withMessage('Vui lòng không để trống mật khẩu')
    .isLength({min:6}).withMessage('Mật khẩu phải tối thiểu 6 ký tự'),
]