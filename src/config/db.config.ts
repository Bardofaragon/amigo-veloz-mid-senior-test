import path from 'path';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

import config from './config.js';
import logger from './logger.js';
import { User } from '../models/user.model.js';
import { Payment } from '../models/payment.model.js';
import { Loan } from '../models/loan.model.js';
import { __dirname } from './path.config.js';

export const sequelize = new Sequelize({
	host: config.sequelize.host,
	port: config.sequelize.port,
	username: config.sequelize.username,
	password: config.sequelize.password,
	database: config.sequelize.database,
	dialect: 'postgres',
	logging: config.sequelize.logging ? (msg) => logger.info(msg) : false,
	models: [User, Loan, Payment],
} as SequelizeOptions);

export const connectToDatabase = async () => {
	try {
		await sequelize.authenticate();
		logger.info('✅ Connected to the PostgreSQL database.');
		if (config.env === 'development') {
			await sequelize.sync({ alter: true });
			logger.info('✅ Database synchronized.');
		}
	} catch (error) {
		logger.error('❌ Unable to connect to the database:', error);
		process.exit(1);
	}
};

export default sequelize;
