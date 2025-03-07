import { User } from '../../models/user.model.js';

// Extend Express Request to include the User type
declare module 'express-serve-static-core' {
	interface Request {
		user?: User;
	}
}
