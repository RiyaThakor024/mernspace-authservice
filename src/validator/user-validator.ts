import { checkSchema } from 'express-validator';
import { Roles } from '../constants';
export default checkSchema({
    firstname: {
        notEmpty: true,
        errorMessage: 'name is required',
    },
    lastname: {
        notEmpty: true,
        errorMessage: 'name is required',
    },
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
        isLength: {
            options: { min: 8 },
            errorMessage: 'password must be atleast 8 character',
        },
    },

    role: {
        errorMessage: 'role is required',
        notEmpty: true,
        isIn: {
            options: [[Roles.MANAGER]],
            errorMessage: 'role is invalid',
        },
    },
});
