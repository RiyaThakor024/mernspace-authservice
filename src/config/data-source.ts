import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Config } from '../config/index';
import { RefreshToken } from '../entities/RefreshToken';
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: Config.DB_HOST,
    port: Config.DB_PORT,
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,
    //don't use in production
    synchronize: Config.NODE_ENV === 'test' || Config.NODE_ENV === 'dev',
    logging: false,
    entities: [User, RefreshToken],
    migrations: ['src/migration/*.ts'],
    subscribers: [],
});
