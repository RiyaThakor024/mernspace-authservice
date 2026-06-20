console.log('SERVER FILE LOADED');
import { Config } from './config/index';
import app from './app';
import { AppDataSource } from './config/data-source';
import { logger } from './config/logger';

const startServer = async () => {
    const PORT = Config.PORT;
    console.log('Database Config:');
    console.log(AppDataSource.options);
    try {
        await AppDataSource.initialize();
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
