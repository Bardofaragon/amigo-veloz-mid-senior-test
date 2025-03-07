import { CreateUserDto } from '../dtos/create-user.dto.js';
import bcrypt from 'bcrypt';
import { User, UserRole } from '../models/user.model.js';
import logger from '../config/logger.js';
import {
	BadRequestError,
	BadRequestError,
	ConflictError,
} from '../middlewares/error-handler/api-errors.js';

const SALT_ROUNDS = 10;

export class UserService {
	/**
	 * Registers a new user
	 * @param createUserDto - The user data to create
	 * @returns The created user
	 */
	public async registerUser(createUserDto: CreateUserDto): Promise<User> {
		const { name, email, password } = createUserDto;

		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			throw new ConflictError('User with this email already exists.');
		}
		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

		const userObj = await User.create({
			name,
			email,
			password: hashedPassword,
			role: UserRole.USER, // Default role
		});

		const user = userObj.get({ plain: true });
		logger.info(`User registered: ${user.email}`);

		return user;
	}

	/**
	 * Validates user credentials for login
	 * @param email - The user's email
	 * @param password - The user's password
	 * @returns The authenticated user if successful
	 */
	public async authenticateUser(
		email: string,
		password: string,
	): Promise<User> {
		const user = await User.findOne({
			where: { email },
			attributes: ['id', 'name', 'email', 'password', 'role'],
		});

		if (!user) {
			throw new BadRequestError('Invalid email or password.');
		}

		const userData = user.get({ plain: true });
		const isPasswordValid = await bcrypt.compare(password, userData.password);

		if (!isPasswordValid) {
			throw new BadRequestError('Invalid email or password.');
		}
		logger.info(`User authenticated: ${user.email}`);

		return userData;
	}
}
