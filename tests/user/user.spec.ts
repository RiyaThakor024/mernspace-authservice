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
import { Tenant } from '../../src/entities/tenents';
import { createTenant } from '../../src/types';

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
        it('should persist the user in the database', async () => {
            const adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            });

            const tenant = await createTenant(connection.getRepository(Tenant));
            const userData = {
                firstname: 'Riya',
                lastname: 'Thakor',
                email: 'riya024@gmail.com',
                password: 'secret123',
                tenantId: tenant.id,
            };

            const response = await request(app)
                .post('/user')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(1);
            expect(users[0].email).toBe(userData.email);
        });

        it('should create a manager user', async () => {
            const adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            });
            const userData = {
                firstname: 'Riya',
                lastname: 'Thakor',
                email: 'riya024@gmail.com',
                password: 'secret123',
                tenantId: 1,
            };

            const response = await request(app)
                .post('/user')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(1);
            expect(users[0].role).toBe(Roles.MANAGER);
        });
    });
});
