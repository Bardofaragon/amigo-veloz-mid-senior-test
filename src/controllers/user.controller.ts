import {
	Post,
	Route,
	Body,
	Tags,
	Get,
	Security,
	Request,
	Controller,
} from 'tsoa';
import { UserService } from '../services/user.service.js';
import { CreateUserDto } from '../dtos/create-user.dto.js';
import { LoginDto } from '../dtos/login.dto.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { User, UserRole } from '../models/user.model.js';
import { Request as ExpressRequest } from 'express';

interface LoginResponse {
	token: string;
}

interface UserResponse {
	id: number;
	name: string;
	email: string;
	role: UserRole;
}

@Route('users')
@Tags('Users')
export class UserController extends Controller {
	private userService = new UserService();

	/**
	 * Registers a new user
	 * @param createUserDto - The user registration data
	 * @returns JWT token for the newly registered user. Ideally you'd want a confirmation of the email or something.
	 * This is just for demo purposes
	 */
	@Post('/register')
	public async register(
		@Request() request: Express.Request,
		@Body() createUserDto: CreateUserDto,
	): Promise<LoginResponse> {
		const user = await this.userService.registerUser(createUserDto);

		const token = jwt.sign(
			{ id: user.id, role: user.role },
			config.jwt.secret,
			{ expiresIn: `${config.jwt.accessExpirationMinutes}m` },
		);
		this.setStatus(201);
		return { token };
	}

	/**
	 * Authenticates a user and returns a JWT token
	 * @param loginDto - The login credentials
	 * @returns JWT token
	 */
	@Post('/login')
	public async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
		const { email, password } = loginDto;
		const user = await this.userService.authenticateUser(email, password);

		const token = jwt.sign(
			{ id: user.id, role: user.role },
			config.jwt.secret,
			{ expiresIn: `${config.jwt.accessExpirationMinutes}m` },
		);

		return { token };
	}

	/**
	 * Returns the authenticated user's data
	 * @param request - Express request object (used to get the authenticated user)
	 * @returns The authenticated user's data
	 */
	@Get('/')
	@Security('jwt', [UserRole.USER, UserRole.ADMIN])
	public async getUserData(
		@Request() request: ExpressRequest,
	): Promise<UserResponse> {
		const user = request.user as User;

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role as UserRole,
		};
	}
}
