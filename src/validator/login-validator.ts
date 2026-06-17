import { checkSchema } from 'express-validator';
export default checkSchema({
    email: {
        errorMessage: 'email is required',
        trim: true,
        notEmpty: true,
        isEmail: {
            errorMessage: 'email is invalid',
        },
    },
    password: {
        errorMessage: 'password is required',
        trim: true,
        notEmpty: true,
    },
});

// export default [body('email').notEmpty().withMessage('email is required')];
