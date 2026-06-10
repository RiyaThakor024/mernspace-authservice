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
    firstname: {
        errorMessage: 'firstname is required',
        trim: true,
        notEmpty: true,
    },
    lastname: {
        errorMessage: 'lastname is required',
        trim: true,
        notEmpty: true,
    },
    password: {
        errorMessage: 'password is required',
        trim: true,
        notEmpty: true,
        isLength: {
            options: { min: 8 },
            errorMessage: 'password must be atleast 8 character',
        },
    },
});
// export default [body('email').notEmpty().withMessage('email is required')];
