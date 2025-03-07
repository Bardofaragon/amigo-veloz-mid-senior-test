import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/user.model.js';

export function RoleGuard(requiredRoles: UserRole[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		const user = req.user as { role: UserRole };

		if (!user || !requiredRoles.includes(user.role)) {
			return res.status(403).json({ message: 'Forbidden' });
		}

		next();
	};
}
