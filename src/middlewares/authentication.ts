import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { Request } from 'express';
import {
	UnauthorizedError,
	ForbiddenError,
	BadRequestError,
} from './error-handler/api-errors.js';

export async function expressAuthentication(
	request: Request,
	securityName: string,
	scopes?: string[],
): Promise<User> {
	if (securityName === 'jwt') {
		const token = request.headers['authorization'];

		if (!token) {
			throw new UnauthorizedError('No token provided');
		}

		try {
			const bearerToken = token.replace('Bearer ', '');
			const decoded = jwt.verify(bearerToken, config.jwt.secret) as User;

			if (scopes && !scopes.includes(decoded.role)) {
				throw new ForbiddenError(
					"You don't have permission to to this operation",
				);
			}

			return decoded;
		} catch (error) {
			if (error instanceof jwt.JsonWebTokenError) {
				throw new UnauthorizedError('Invalid token');
			}
			throw new BadRequestError('Failed to authenticate token');
		}
	}

	throw new BadRequestError('Invalid security name');
}
