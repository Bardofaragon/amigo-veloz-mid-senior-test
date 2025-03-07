import {
	describe,
	it,
	expect,
	beforeAll,
	beforeEach,
	afterEach,
	afterAll,
} from 'vitest';
import { UserService } from '../services/user.service.js';
import { User, UserRole } from '../models/user.model.js';
import { CreateUserDto } from '../dtos/create-user.dto.js';
import { connectToDatabase, sequelize } from '../config/db.config.js';
import bcrypt from 'bcrypt';
import {
	ConflictError,
	BadRequestError,
} from '../middlewares/error-handler/api-errors.js';

const userService = new UserService();

beforeAll(async () => {
	await connectToDatabase();
});

beforeEach(async () => {
	await User.create({
		name: 'Existing User',
		email: 'existing@example.com',
		password: await bcrypt.hash('password123', 10),
		role: UserRole.USER,
	});
});

afterEach(async () => {
	await User.destroy({ where: {}, truncate: true, cascade: true });
});

afterAll(async () => {
	await sequelize.close();
});

describe('UserService Integration Tests', () => {
	describe('registerUser', () => {
		it('should create a new user successfully', async () => {
			const createUserDto: CreateUserDto = {
				name: 'John Doe',
				email: 'john@example.com',
				password: 'password123',
			};

			const user = await userService.registerUser(createUserDto);

			expect(user).toBeDefined();
			expect(user.email).toBe('john@example.com');
		});

		it('should throw a conflict error if the user already exists', async () => {
			const createUserDto: CreateUserDto = {
				name: 'Existing User',
				email: 'existing@example.com',
				password: 'password123',
			};

			await expect(userService.registerUser(createUserDto)).rejects.toThrow(
				ConflictError,
			);
		});
	});

	describe('authenticateUser', () => {
		it('should authenticate a user with valid credentials', async () => {
			const user = await userService.authenticateUser(
				'existing@example.com',
				'password123',
			);

			expect(user).toBeDefined();
			expect(user.email).toBe('existing@example.com');
		});

		it('should throw a bad request error if the email is invalid', async () => {
			await expect(
				userService.authenticateUser('invalid@example.com', 'password123'),
			).rejects.toThrow(BadRequestError);
		});

		it('should throw a bad request error if the password is incorrect', async () => {
			await expect(
				userService.authenticateUser('existing@example.com', 'wrongpassword'),
			).rejects.toThrow(BadRequestError);
		});
	});
});
