import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { RegisterRoutes } from './routes/routes.js';
import config from './config/config.js';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './routes/openapi.json';
import { errorHandler } from './middlewares/error-handler/index.js';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

if (config.env === 'development') {
	// THIS IS IF THE DOCUMENTATION IS PRIVATE, BUT IF IT CAN BE PUBLIC WE CAN REMOVE THE VALIDATION OF ENV
	app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

RegisterRoutes(app);

app.use(errorHandler);

export default app;
