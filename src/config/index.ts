import { config } from 'dotenv';

config();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const { NODE_ENV } = process.env;

export const Config = {
    PORT: port,
    NODE_ENV,
};
