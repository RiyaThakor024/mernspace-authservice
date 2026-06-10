/// <reference types="jest" />
import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { truncateTables } from '../utils';
import { User } from '../../src/entities/User';
import { Roles } from '../../src/constants';
describe('POST /auth/register', () => {
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
        it('should return an id of the created user', async () => {
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
            expect(response.body.id).toBeDefined();
        });
        it('should assign a customer role', async () => {
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
            //assert

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0]).toHaveProperty('role');
            expect(users[0].role).toBe(Roles.CUSTOMER);
        });
        it('should store the hashed password in database', async () => {
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
            console.log(users[0].password);
            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
        });
        it('should return 400 statuscode if email is already exists', async () => {
            const userData = {
                firstname: 'Riya',
                lastname: 'Thakor',
                email: 'riya024@gmail.com',
                password: 'secret',
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save({ ...userData, role: Roles.CUSTOMER });

            //Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            //Assert
            const users = await userRepository.find();
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });
    });
    describe('field are missing', () => {
        it('should return 400 status code if email does not exist', async () => {
            const userData = {
                firstname: 'Riya',
                lastname: 'Thakor',
                email: '',
                password: 'secret',
            };
            //Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            //Assert
            console.log(response.body);

            expect(response.statusCode).toBe(400);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
    });
});
