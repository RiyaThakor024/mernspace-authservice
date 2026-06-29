import { checkSchema } from 'express-validator';
export default checkSchema({
    name: {
        notEmpty: true,
        errorMessage: 'name is required',
    },
    address: {
        notEmpty: true,
        errorMessage: 'address is required',
    },
});
