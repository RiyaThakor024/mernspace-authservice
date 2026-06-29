import createHttpError from 'http-errors';
import { User } from '../entities/User';
import { UserData } from '../types';
import { Repository } from 'typeorm';
import { Roles } from '../constants/index';
import bcrypt from 'bcrypt';
export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstname, lastname, email, password, role }: UserData) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        if (user) {
            const error = createHttpError(400, 'email is already exists');
            throw error;
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        try {
            const user = await this.userRepository.save({
                firstname,
                lastname,
                email,
                password: hashedPassword,
                role: role ?? Roles.MANAGER,
            });
            return user;
        } catch {
            const error = createHttpError(
                500,
                'failed to store the data in the  database',
            );
            throw error;
        }
    }
    async findByEmail(email: string) {
        return await this.userRepository.findOne({
            where: {
                email,
            },
        });
    }
    async findById(id: number) {
        return await this.userRepository.findOne({
            where: {
                id,
            },
        });
    }
}
