/// <reference types="jest" />

import app from '../../src/app';
import { AppDataSource } from '../../src/config/data-source';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { Tenant } from '../../src/entities/tenents';
import createJWKSMock from 'mock-jwks';
import { Roles } from '../../src/constants';

describe('POST/tenant', () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    let adminToken: string;

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
        await connection.dropDatabase();
        await connection.synchronize();
        jwks.start();

        adminToken = jwks.token({
            sub: '1',
            role: Roles.ADMIN,
        });
    });

    afterAll(async () => {
        if (connection && connection.isInitialized) {
            await connection.destroy();
        }
    });
    afterEach(async () => {
        jwks.stop();
    });
    describe('given all fields', () => {
        it('should return 201 status code', async () => {
            const tenantData = {
                name: 'Tenant name',
                address: 'Tenant address',
            };
            const response = await request(app)
                .post('/tenant')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData);

            expect(response.statusCode).toBe(201);
        });
        it('should create tenant in database', async () => {
            const tenantData = {
                name: 'Tenant name',
                address: 'Tenant address',
            };
            const response = await request(app)
                .post('/tenant')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData);

            const tenantRepositary = connection.getRepository(Tenant);
            const tenant = await tenantRepositary.find();
            expect(tenant).toHaveLength(1);
            expect(tenant[0].name).toBe(tenantData.name);
            expect(tenant[0].address).toBe(tenantData.address);
        });
        it('sohuld return 403 if user is not an admin', async () => {
            const managerToken = jwks.token({
                sub: '1',
                role: Roles.MANAGER,
            });

            const tenantData = {
                name: 'Tenant name',
                address: 'Tenant address',
            };
            const response = await request(app)
                .post('/tenant')
                .set('Cookie', [`accessToken=${managerToken}`])
                .send(tenantData);
            expect(response.statusCode).toBe(403);
            const tenantRepositary = connection.getRepository(Tenant);
            const tenant = await tenantRepositary.find();
            expect(tenant).toHaveLength(0);
            expect(tenant).toEqual([]);
        });

        it('sohuld return 401 if user is not authenticated', async () => {
            const tenantData = {
                name: 'Tenant name',
                address: 'Tenant address',
            };
            const response = await request(app)
                .post('/tenant')
                .send(tenantData);
            expect(response.statusCode).toBe(401);
            const tenantRepositary = connection.getRepository(Tenant);
            const tenant = await tenantRepositary.find();
            expect(tenant).toHaveLength(0);
            expect(tenant).toEqual([]);
        });
    });
});
