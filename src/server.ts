import { Config } from './config/index';
import app from './app';
import { AppDataSource } from './config/data-source';
import { logger } from './config/logger';
import { createAdmin } from './utils';

const startServer = async () => {
    const PORT = Config.PORT;
    try {
        await AppDataSource.initialize();
        await createAdmin();
        logger.info('database conected successfuly');
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

void startServer();
