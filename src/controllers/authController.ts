import { NextFunction, Response } from 'express';
import { RegisterUserRequest } from '../types';
import { UserService } from '../services/UserService';
import { Logger } from 'pino';
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
            return res.status(201).json({
                id: saveUser.id,
            });
        } catch (error) {
            next(error);
            return;
        }
    }
}
