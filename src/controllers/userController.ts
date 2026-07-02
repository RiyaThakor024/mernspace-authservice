import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { CreateUserRequest, UserData } from '../types';
import { validationResult } from 'express-validator';
import pino, { Logger } from 'pino';
import createHttpError from 'http-errors';

export class UserController {
    private logger: Logger = pino();

    constructor(private userService: UserService) {}

    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        //validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const { firstname, lastname, email, password, role, tenantId } =
            req.body;

        this.logger.debug({ body: req.body }, 'reques fro creating the user');

        try {
            const user = await this.userService.create({
                firstname,
                lastname,
                email,
                password,
                role,
                tenantId,
            });
            this.logger.info({ id: user.id }, 'user has been created');
            res.status(201).json({ id: user.id });
        } catch (error) {
            next(error);
            return;
        }
    }
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userService.getAll();
            return res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    async userById(req: Request, res: Response) {
        const userId = Number(req.params.id);
        const user = await this.userService.findById(userId);
        if (!user) {
            throw createHttpError(404, 'User not found');
        }
        res.status(200).json(user);
    }
    async updatedUser(req: Request, res: Response) {
        const userId = Number(req.params.id);
        const userData = req.body as UserData;
        const updatedUser = await this.userService.updateUser(userId, userData);

        this.logger.info({ id: userId }, 'User has been updated successfully');
        res.status(200).json(updatedUser);
    }
    async deleteUser(req: Request, res: Response) {
        const userId = Number(req.params.id);
        await this.userService.deleteUser(userId);
        this.logger.info({ id: userId }, 'User has been deleted');
        res.status(204).send();
    }
}
