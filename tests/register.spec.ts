/// <reference types="jest" />
import request from 'supertest';
import app from '../src/app';
describe('POST /auth/register', () => {
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
        });
    });
});
