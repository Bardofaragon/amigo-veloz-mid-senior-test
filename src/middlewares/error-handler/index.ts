import { Request, Response, NextFunction } from 'express';
import { ApiError } from './api-errors.js';
import { ValidateError } from 'tsoa';
import logger from '../../config/logger.js';
export * from './api-errors.js';

export function errorHandler(
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction,
): void {
	if (err instanceof ApiError) {
		res.status(err.statusCode).json({ message: err.message });
	} else if (err instanceof ValidateError) {
		console.warn(`Validation Error for ${_req.path}: `, err.fields);
		res.status(422).json({
			message: 'Validation Failed',
			details: err?.fields,
		});
	} else {
		logger.error(`Uncaught Exception: ${err.message}`);
		logger.error(err.stack);
		res.status(500).json({ message: 'Internal Server Error' });
	}
}
