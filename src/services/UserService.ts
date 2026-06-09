import createHttpError from 'http-errors';
import { User } from '../entities/User';
import { UserData } from '../types';
import { Repository } from 'typeorm';

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstname, lastname, email, password }: UserData) {
        try {
            const user = await this.userRepository.save({
                firstname,
                lastname,
                email,
                password,
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
}
