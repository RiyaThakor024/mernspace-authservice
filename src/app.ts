import express, {
    type Request,
    type Response,
    type NextFunction,
} from 'express';
import { logger } from './config/logger.js';
import type { HttpError } from 'http-errors';
import createHttpError from 'http-errors';

const app = express();

app.get('/', (req, res) => {
    const err = createHttpError(401, 'you can not access this route.');
    throw err;
    res.send('welcome to auth service');
});
// global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: '',
                location: '',
            },
        ],
    });
});
export default app;
