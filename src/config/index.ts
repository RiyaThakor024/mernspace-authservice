import { config } from 'dotenv';
import path from 'path';

const env =
    process.env.NODE_ENV ?? (process.env.JEST_WORKER_ID ? 'test' : 'dev');

config({
    path: path.join(__dirname, `../../.env.${env}`),
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

export const Config = {
    PORT: port,
    NODE_ENV: env,
    DB_HOST: process.env.DB_HOST!,
    DB_PORT: Number(process.env.DB_PORT!),
    DB_USERNAME: process.env.DB_USERNAME!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    DB_NAME: process.env.DB_NAME!,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET!,
    JWKS_URI: process.env.JWKS_URI!,
    PRIVATE_KEY: process.env.PRIVATE_KEY!,
    ADMIN_NAME: process.env.ADMIN_NAME!,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,
};
