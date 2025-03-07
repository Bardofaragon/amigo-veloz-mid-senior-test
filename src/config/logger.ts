import winston, { format, transports, LoggerOptions, Logger } from 'winston';
import config from './config.js';

const enumerateErrorFormat = format((info) => {
	if (info instanceof Error) {
		Object.assign(info, { message: info.stack });
	}
	return info;
});

const options: LoggerOptions = {
	level: config.env === 'development' ? 'debug' : 'info',
	format: format.combine(
		enumerateErrorFormat(),
		config.env === 'development' ? format.colorize() : format.uncolorize(),
		format.splat(),
		format.printf(({ level, message }) => `${level}: ${message}`),
	),
	transports: [
		new transports.Console({
			stderrLevels: ['error'],
		}),
	],
};

const logger: Logger = winston.createLogger(options);

export default logger;
