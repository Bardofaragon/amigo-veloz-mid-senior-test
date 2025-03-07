export interface SequelizeConfig {
	host: string;
	port: number;
	username: string;
	password: string;
	database: string;
	dialect: 'postgres';
	logging: boolean;
}

export interface JwtConfig {
	secret: string;
	accessExpirationMinutes: number;
	refreshExpirationDays: number;
	resetPasswordExpirationMinutes: number;
	verifyEmailExpirationMinutes: number;
}

export interface Config {
	env: string;
	port: number;
	sequelize: SequelizeConfig;
	jwt: JwtConfig;
}
