/// <reference types="jest" />

import app from '../../src/app';
import { AppDataSource } from '../../src/config/data-source';
import { DataSource } from 'typeorm';
import request from 'supertest';

describe('POST/tenant', () => {
    let connection: DataSource;

    beforeAll(async () => {
        try {
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
    });

    afterAll(async () => {
        if (connection && connection.isInitialized) {
            await connection.destroy();
        }
    });
    describe('given all fields', () => {
        it('should return 201 status code', async () => {
            const tenantData = {
                name: 'Tenant name',
                address: 'Tenant address',
            };
            const response = await request(app)
                .post('/tenant')
                .send(tenantData);

            expect(response.statusCode).toBe(201);
        });
    });
});
