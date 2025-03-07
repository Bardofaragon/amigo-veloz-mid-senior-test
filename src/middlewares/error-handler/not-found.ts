import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from './api-errors.js';

export function notFoundHandler(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	next(new NotFoundError(`Route not found`));
}
