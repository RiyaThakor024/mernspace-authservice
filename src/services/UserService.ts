import { User } from '../entities/User';
import { UserData } from '../types';
import { Repository } from 'typeorm';

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstname, lastname, email, password }: UserData) {
        await this.userRepository.save({
            firstname,
            lastname,
            email,
            password,
        });
    }
}
