// import fs from 'fs';
// import path from 'path';
import { NextFunction, Response } from 'express';
import { AuthRequest, RegisterUserRequest } from '../types';
import { UserService } from '../services/UserService';
import { Logger } from 'pino';
// import createHttpError from 'http-errors';
import { validationResult } from 'express-validator';
// import createHttpError from 'http-errors';
// import { Config } from '../config';
// import { AppDataSource } from '../config/data-source';
// import { RefreshToken } from '../entities/RefreshToken';
import { TokenService } from '../services/TokenService';
import createHttpError from 'http-errors';
import { CredentialService } from '../services/CredentialService';
import { AuthTokenService } from '../services/AuthTokenService';
import { Roles } from '../constants';
// import { error } from 'node:console';
export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
        private credentialService: CredentialService,
        private authTokenService: AuthTokenService,
    ) {}
    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        //validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
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
                role: Roles.CUSTOMER,
            });
            this.logger.info({ id: saveUser.id }, 'user has been registered');
            await this.authTokenService.generateAndSetToken(saveUser, res);
            // let privateKey: Buffer;
            // try {
            // privateKey = fs.readFileSync(path.join(__dirname,'../../certs/private.pem'));

            // } catch {
            //    const err = createHttpError(500,'Error while reading private key');
            //    next(err);
            //    return;
            // }
            // const accessToken = sign(payload,privateKey,{
            //     algorithm:'RS256',
            //     expiresIn:'1h',
            //     issuer:'auth-service',
            // });
            //persist the refresh token
            // const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
            // const refreshTokenRepository =
            //     AppDataSource.getRepository(RefreshToken);
            // const newRefreshToken = await refreshTokenRepository.save({
            //     user: saveUser,
            //     expiresAt: new Date(Date.now() + MS_IN_YEAR),
            // });
            // const refreshToken = sign(payload,Config.REFRESH_TOKEN_SECRET,{
            //     algorithm:'HS256',
            //     expiresIn:'1y',
            //     issuer:'auth-service',
            //     jwtid:String(newRefreshToken.id),
            // });

            return res.status(201).json({
                id: saveUser.id,
            });
        } catch (error) {
            next(error);
            return;
        }
    }
    async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
        //validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const { email, password } = req.body;
        this.logger.debug(
            {
                email,
                password: '******',
            },
            'new request to login a user',
        );
        try {
            const user = await this.userService.findByEmail(email);
            if (!user) {
                const error = createHttpError(
                    400,
                    'Email or password does not match',
                );
                next(error);
                return;
            }
            const passwordMatch = await this.credentialService.comparePassword(
                password,
                user.password,
            );
            if (!passwordMatch) {
                const error = createHttpError(
                    400,
                    'Email or password does not match',
                );
                next(error);
                return;
            }
            // this.logger.info({ id: saveUser.id }, 'user has been registered');
            await this.authTokenService.generateAndSetToken(user, res);
            return res.status(200).json({
                id: user.id,
            });
        } catch (error) {
            next(error);
            return;
        }
    }

    async self(req: AuthRequest, res: Response) {
        //token req.auth.sub
        const user = await this.userService.findById(Number(req.auth.sub));
        if (!user) {
            throw createHttpError(404, 'User not found');
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
    }

    async refresh(req: AuthRequest, res: Response, next: NextFunction) {
        const user = await this.userService.findById(Number(req.auth.sub));
        if (!user) {
            const error = createHttpError(
                400,
                'user with tokem could not find',
            );
            next(error);
            return;
        }

        try {
            const oldRefreshTokenId = Number(req.auth.id);
            await this.tokenService.deleteRefreshToken(oldRefreshTokenId);
            await this.authTokenService.generateAndSetToken(user, res);
            return res.status(200).json({
                id: user.id,
            });
        } catch (error) {
            next(error);
            return;
        }
    }
    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await this.tokenService.deleteRefreshToken(Number(req.auth.id));
            this.logger.info(
                { id: req.auth.id },
                'Refresh token has been deleted',
            );
            this.logger.info({ id: req.auth.sub }, 'user has been logged out');
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.json({});
        } catch (error) {
            next(error);
            return;
        }
    }
}
