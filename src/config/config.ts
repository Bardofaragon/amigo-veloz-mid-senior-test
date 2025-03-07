import * as dotenv from 'dotenv';
import * as path from 'path';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { ConfigDto } from './config.dto.js';
import { Config } from '../types/config.types.js';

dotenv.config();

const envConfig = plainToInstance(ConfigDto, process.env, {
	enableImplicitConversion: true,
});

const errors = validateSync(envConfig, {
	skipMissingProperties: false,
});

if (errors.length > 0) {
	throw new Error(
		`Config validation error: ${errors.map((e) => Object.values(e.constraints || {})).join(', ')}`,
	);
}

const config: Config = {
	env: envConfig.NODE_ENV,
	port: envConfig.PORT,
	sequelize: {
		host: envConfig.POSTGRES_HOST,
		port: envConfig.POSTGRES_PORT,
		username: envConfig.POSTGRES_USER,
		password: envConfig.POSTGRES_PASSWORD,
		database: envConfig.POSTGRES_DB,
		dialect: 'postgres',
		logging: envConfig.NODE_ENV === 'development',
	},
	jwt: {
		secret: envConfig.JWT_SECRET,
		accessExpirationMinutes: envConfig.JWT_ACCESS_EXPIRATION_MINUTES,
		refreshExpirationDays: envConfig.JWT_REFRESH_EXPIRATION_DAYS,
		resetPasswordExpirationMinutes:
			envConfig.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
		verifyEmailExpirationMinutes: envConfig.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
	},
};

export default config;
