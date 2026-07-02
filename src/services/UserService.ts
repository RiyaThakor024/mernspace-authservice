import createHttpError from 'http-errors';
import { User } from '../entities/User';
import { UserData } from '../types';
import { Repository } from 'typeorm';
import { Roles } from '../constants/index';
import bcrypt from 'bcrypt';
export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({
        firstname,
        lastname,
        email,
        password,
        role,
        tenantId,
    }: UserData) {
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
                tenant: tenantId ? { id: tenantId } : undefined,
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
    async getAll() {
        return await this.userRepository.find();
    }
    async updateUser(id: number, data: UserData) {
        const user = await this.userRepository.findOne({
            where: {
                id,
            },
        });
        if (!user) {
            throw createHttpError(404, 'User not found');
        }

        user.firstname = data.firstname;
        user.lastname = data.lastname;
        user.email = data.email;
        user.role = data.role;
        if (data.password) {
            user.password = await bcrypt.hash(data.password, 10);
        }

        const updatedUser = await this.userRepository.save(user);
        return updatedUser;
    }

    async deleteUser(id: number) {
        const user = await this.userRepository.findOne({
            where: {
                id,
            },
        });

        if (!user) {
            throw createHttpError(404, 'User not found');
        }

        await this.userRepository.remove(user);
    }
}
