import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Config } from '../config/index';
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: Config.DB_HOST,
    port: Config.DB_PORT,
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,
    //don't use in production
    ssl: {
        rejectUnauthorized: false,
    },
    synchronize: Config.NODE_ENV === 'test' || Config.NODE_ENV === 'dev',
    logging: false,
    entities: ['src/entities/*.{ts,js}'],
    migrations: ['src/migration/*.{ts,js}'],
    subscribers: [],
});
