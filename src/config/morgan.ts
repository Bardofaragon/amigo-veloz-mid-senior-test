import morgan, { StreamOptions } from 'morgan';
import config from '../config/config.js';
import logger from '../config/logger.js';
import { Request, Response } from 'express';

morgan.token(
	'message',
	(req: Request, res: Response) => res.locals.errorMessage || '',
);

const getIpFormat = () =>
	config.env === 'production' ? ':remote-addr - ' : '';

const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const stream: StreamOptions = {
	write: (message: string) => logger.info(message.trim()),
};

export const successHandler = morgan(successResponseFormat, {
	skip: (_: Request, res: Response) => res.statusCode >= 400,
	stream,
});

export const errorHandler = morgan(errorResponseFormat, {
	skip: (_: Request, res: Response) => res.statusCode < 400,
	stream: {
		write: (message: string) => logger.error(message.trim()),
	},
});
