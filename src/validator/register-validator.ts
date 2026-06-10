import { checkSchema } from 'express-validator';
export default checkSchema({
    email: {
        notEmpty: true,
    },
});
// export default [body('email').notEmpty().withMessage('email is required')];
