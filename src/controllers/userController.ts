import { Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import { CreateUserRequest } from '../types';

export class UserController {
    constructor(private userService: UserService) {}

    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        const { firstname, lastname, email, password, role } = req.body;

        try {
            const user = await this.userService.create({
                firstname,
                lastname,
                email,
                password,
                role,
            });
            res.status(201).json({ id: user.id });
        } catch (error) {
            next(error);
        }
    }
}
