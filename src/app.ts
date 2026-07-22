import 'reflect-metadata';

import express, {
    type Request,
    type Response,
    type NextFunction,
} from 'express';
import { logger } from './config/logger';
import createHttpError from 'http-errors';
import type { HttpError } from 'http-errors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth';
import tenantRouter from './routes/tenants';
import cors from 'cors';
import userRouter from './routes/user';
import jwksRouter from './routes/jwks';
const app = express();

app.use(
    cors({
        //todo move the .env file
        origin: ['http://localhost:5173'],
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.static('public'));
app.use('/.well-known', jwksRouter);
app.get('/', (req, res) => {
    const err = createHttpError(401, 'you can not access this route.');
    throw err;
    res.send('welcome to auth service');
});
app.use(cookieParser());
app.use('/auth', authRouter);
app.use('/tenant', tenantRouter);
app.use('/user', userRouter);

// global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    const e = err as unknown as { status?: number; statusCode?: number };
    const statusCode =
        typeof e.status === 'number'
            ? e.status
            : typeof e.statusCode === 'number'
              ? e.statusCode
              : 500;

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
