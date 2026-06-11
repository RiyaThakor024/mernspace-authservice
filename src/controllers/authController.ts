import fs from 'fs';
import path from 'path';
import { NextFunction, Response } from 'express';
import { RegisterUserRequest } from '../types';
import { UserService } from '../services/UserService';
import { Logger } from 'pino';
// import createHttpError from 'http-errors';
import { validationResult } from 'express-validator';
import { JwtPayload, sign } from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { Config } from '../config';
// import { error } from 'node:console';
export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}
    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        //validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ error: result.array() });
        }
        const { firstname, lastname, email, password } = req.body;
        this.logger.debug(
            {
                firstname,
                lastname,
                email,
                password: '******',
            },
            'new request to register a user',
        );
        try {
            const saveUser = await this.userService.create({
                firstname,
                lastname,
                email,
                password,
            });
            this.logger.info({ id: saveUser.id }, 'user has been registered');

            let privateKey: Buffer;
            try {
            privateKey = fs.readFileSync(path.join(__dirname,'../../certs/private.pem'));
                
            } catch {
               const err = createHttpError(500,'Error while reading private key');
               next(err);
               return; 
            }
            const payload:JwtPayload = {
               sub:String(saveUser.id),
               role:saveUser.role
            }
            const accessToken = sign(payload,privateKey,{
                algorithm:'RS256',
                expiresIn:'1h',
                issuer:'auth-service',
            });
            const refreshToken = sign(payload,Config.REFRESH_TOKEN_SECRET,{
                algorithm:'HS256',
                expiresIn:'1y',
                issuer:'auth-service'
            });

            res.cookie('accessToken',accessToken,{
               domain:'localhost',
               sameSite:'strict',
               maxAge:1000*60*60,//1h
               httpOnly:true,//very imp
                
            })
            res.cookie('refreshToken',refreshToken,{
                domain:'localhost',
                sameSite:'strict',
                maxAge:1000*60*60*24*365,
                httpOnly:true
            })
            return res.status(201).json({
                id: saveUser.id,
            });
        } catch (error) {
            next(error);
            return;
        }
    }
}
