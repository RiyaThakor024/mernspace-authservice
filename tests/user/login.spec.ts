/// <reference types="jest" />

import app from '../../src/app';
import { AppDataSource } from '../../src/config/data-source';
import { DataSource } from 'typeorm';
import request, { cookies } from 'supertest';
import { cookie } from 'express-validator';
import { isJwt } from '../utils';
import { accessSync } from 'node:fs';
import jwks from '../../public/.well-known/jwks.json';

describe('POST/auth/login', () => {
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
        it('should login the user', async () => {
            const userData = {
                firstname: 'Riya',
                lastname: 'Thakor',
                email: 'riya024@gmail.com',
                password: 'secret123',
            };
            //Act
            await request(app).post('/auth/register').send(userData);

            const response = await request(app).post('/auth/login').send({
                email: userData.email,
                password: userData.password,
            });
            //Assert
            expect(response.statusCode).toBe(200);
        });
        describe('when email or password is invalid', () => {
            it('should return the 400 if email or passwrod is wrong', async () => {
                const userData = {
                    firstname: 'Riya',
                    lastname: 'Thakor',
                    email: 'riya024@gmail.com',
                    password: 'secret123',
                };
                //Act
                await request(app).post('/auth/register').send(userData);

                const response = await request(app).post('/auth/login').send({
                    email: 'riya02@gmail.com',
                    password: 'secret123',
                });
                //Assert
                expect(response.statusCode).toBe(400);
                expect(response.body.errors[0].msg).toBe(
                    'Email or password does not match',
                );
            });
            it('should return the 400 if email or passwrod is wrong', async () => {
                const userData = {
                    firstname: 'Riya',
                    lastname: 'Thakor',
                    email: 'riya024@gmail.com',
                    password: 'secret123',
                };
                //Act
                await request(app).post('/auth/register').send(userData);

                const response = await request(app).post('/auth/login').send({
                    email: 'riya02@gmail.com',
                    password: 'secret23',
                });
                //Assert
                expect(response.statusCode).toBe(400);
                expect(response.body.errors[0].msg).toBe(
                    'Email or password does not match',
                );
            });
        });
        it('should return the accessToken and refresh token inside the cookie', async () => {
            const userData = {
                firstname: 'Riya',
                lastname: 'Thakor',
                email: 'riya024@gmail.com',
                password: 'secret123',
            };
            //Act
            await request(app).post('/auth/register').send(userData);

            const response = await request(app).post('/auth/login').send({
                email: userData.email,
                password: userData.password,
            });
            interface Headers {
                ['set-cookie']: string[];
            }
            let accessToken = null;
            let refreshToken = null;

            //Assert
            const cookies =
                (response.headers as unknown as Headers)['set-cookie'] || [];
            cookies.forEach((cookie) => {
                if (cookie.startsWith('accessToken')) {
                    accessToken = cookie.split(';')[0].split('=')[1];
                }
                if (cookie.startsWith('refreshToken')) {
                    refreshToken = cookie.split(';')[0].split('=')[1];
                }
            });
            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();

            expect(isJwt(accessToken)).toBeTruthy();
            expect(isJwt(refreshToken)).toBeTruthy();
        });
    });
});
