import config from './config/config.js';
import logger from './config/logger.js';
import app from './app.js';
import { connectToDatabase } from './config/db.config.js';

const startServer = async () => {
	try {
		await connectToDatabase();
		app.listen(config.port, () => {
			logger.info(`🚀 Server is running at http://localhost:${config.port}`);
		});
	} catch (error) {
		logger.error('❌ Server failed to start:', error);
		process.exit(1);
	}
};

startServer();
