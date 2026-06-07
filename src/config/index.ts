import { config } from 'dotenv';
import path from 'path';

config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`),
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

export const Config = {
    PORT: port,
    NODE_ENV: process.env.NODE_ENV!,
    DB_HOST: process.env.DB_HOST!,
    DB_PORT: Number(process.env.DB_PORT!),
    DB_USERNAME: process.env.DB_USERNAME!,
    DB_PASSWORD: process.env.DB_PASSWORD!,
    DB_NAME: process.env.DB_NAME!,
};
