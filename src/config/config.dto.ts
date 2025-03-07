import 'reflect-metadata';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

enum Environment {
	Development = 'development',
	Production = 'production',
	Test = 'test',
}

export class ConfigDto {
	@IsEnum(Environment)
	NODE_ENV!: Environment;

	@IsNumber()
	@Transform(({ value }) => Number(value))
	PORT: number = 3000;

	@IsString()
	POSTGRES_HOST!: string;

	@IsNumber()
	@Transform(({ value }) => Number(value))
	POSTGRES_PORT: number = 5432;

	@IsString()
	POSTGRES_USER!: string;

	@IsString()
	POSTGRES_PASSWORD!: string;

	@IsString()
	POSTGRES_DB!: string;

	@IsString()
	JWT_SECRET!: string;

	@IsNumber()
	@Transform(({ value }) => Number(value))
	JWT_ACCESS_EXPIRATION_MINUTES: number = 30;

	@IsNumber()
	@Transform(({ value }) => Number(value))
	JWT_REFRESH_EXPIRATION_DAYS: number = 30;

	@IsNumber()
	@Transform(({ value }) => Number(value))
	JWT_RESET_PASSWORD_EXPIRATION_MINUTES: number = 10;

	@IsNumber()
	@Transform(({ value }) => Number(value))
	JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: number = 10;
}
