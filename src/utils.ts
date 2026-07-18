import { Config } from './config';
import { AppDataSource } from './config/data-source';
import bcrypt from 'bcrypt';

import { User } from './entities/User';
import { Roles } from './constants';
import { logger } from './config/logger';

export const calculateDiscount = (price: number, percentage: number) => {
    return price * (percentage / 100);
};

export const createAdmin = async () => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const admin = await userRepository.findOne({
            where: {
                email: Config.ADMIN_EMAIL,
            },
        });
        if (admin) {
            return;
        }

        if (
            !Config.ADMIN_PASSWORD ||
            typeof Config.ADMIN_PASSWORD !== 'string'
        ) {
            throw new Error('ADMIN_PASSWORD is not set or is not a string');
        }

        const hashPassword = await bcrypt.hash(Config.ADMIN_PASSWORD, 10);

        const adminUser = userRepository.create({
            firstname: Config.ADMIN_NAME,
            lastname: 'User',
            email: Config.ADMIN_EMAIL,
            password: hashPassword,
            role: Roles.ADMIN,
        });
        await userRepository.save(adminUser);

        logger.info('Admin user created successfully');
    } catch (error) {
        logger.error({ error }, 'Error creating admin');
    }
};
