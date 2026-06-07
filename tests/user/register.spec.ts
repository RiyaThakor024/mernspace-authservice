/// <reference types="jest" />
import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { truncateTables } from '../utils';
import { User } from '../../src/entities/User';
describe('POST /auth/register', () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        //truncate
        await truncateTables(connection);
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe('given all field', () => {
        it('should return 201 statusvode', async () => {
            //Arrange
            const userData = {
                firstname: 'Riya',
                lastname: 'Thakor',
                email: 'riya024@gmail.com',
                password: 'secret',
            };
            //Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            //Assert
            expect(response.statusCode).toBe(201);
        });
        it('should return json format', async () => {
            //Arrange
            const userData = {
                firstname: 'Riya',
                lastname: 'Thakor',
                email: 'riya024@gmail.com',
                password: 'secret',
            };
            //Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            //Assert
            expect(
                (response.headers as Record<string, string>)['content-type'],
            ).toEqual(expect.stringContaining('json'));
        });
        it('should persist the user in the database', async () => {
            const userData = {
                firstname: 'Riya',
                lastname: 'Thakor',
                email: 'riya024@gmail.com',
                password: 'secret',
            };
            //Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            //Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0].firstname).toBe(userData.firstname);
            expect(users[0].lastname).toBe(userData.lastname);
            expect(users[0].email).toBe(userData.email);
        });
    });
});
