/// <reference types="jest" />

import app from '../../src/app';
import { AppDataSource } from '../../src/config/data-source';
import { DataSource } from 'typeorm';
import createJWKSMock from 'mock-jwks';
import request, { cookies } from 'supertest';
import { cookie } from 'express-validator';
import { isJwt } from '../utils';
import { accessSync } from 'node:fs';
import { User } from '../../src/entities/User';
import { Roles } from '../../src/constants';

describe('GET/auth/self', () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    beforeAll(async () => {
        try {
            jwks = createJWKSMock('http://localhost:5501');
            connection = await AppDataSource.initialize();
            console.log('Database connected');
        } catch (error) {
            console.error(error);
        }
    });

    beforeEach(async () => {
        //truncate
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
    });
    afterEach(async () => {
        jwks.stop();
    });

    afterAll(async () => {
        if (connection && connection.isInitialized) {
            await connection.destroy();
        }
    });
    describe('given all fields', () => {
        it('should return 401 status code if token is missing', async () => {
            const response = await request(app).get('/auth/self').send();
            expect(response.statusCode).toBe(401);
        });
        it('should return 200 status code', async () => {
            const userData = {
                firstname: 'Riya',
                lastname: 'Thakor',
                email: 'riya024@gmail.com',
                password: 'secret123',
            };
            const userRepository = connection.getRepository(User);
            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });

            //genrate token

            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            });
            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken}`])
                .send();
            expect(response.statusCode).toBe(200);
        });

        it('should return the user data', async () => {
            //Register user
            const userData = {
                firstname: 'Riya',
                lastname: 'Thakor',
                email: 'riya024@gmail.com',
                password: 'secret123',
            };
            const userRepository = connection.getRepository(User);
            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });

            //genrate token
            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            });

            //Add token to cookie
            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken};`])
                .send();

            //Assert
            //check if user id matches  with registered user
            expect(response.body.id).toBe(data.id);
        });
        it('should not return the password field', async () => {
            //Register user
            const userData = {
                firstname: 'Riya',
                lastname: 'Thakor',
                email: 'riya024@gmail.com',
                password: 'secret123',
            };
            const userRepository = connection.getRepository(User);
            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });

            //genrate token
            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            });

            //Add token to cookie
            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken};`])
                .send();

            //Assert
            //check if user id matches  with registered user
            expect(response.body.id).toBe(data.id);
            expect(response.body).not.toHaveProperty('password');
        });
    });
});
