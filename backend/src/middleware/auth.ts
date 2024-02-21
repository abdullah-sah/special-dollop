import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || randomUUID();

const authenticate = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	const ignoredPath = req.path == '/signup' || req.path == '/signin';

	if (token == null && !ignoredPath)
		return res.status(401).send({
			success: false,
			error: 'Your token was not recongnised/you are not authorised.',
		});

	jwt.verify(token || '', JWT_SECRET, (err, user) => {
		if (err && !ignoredPath)
			return res.status(403).json({
				success: false,
				message: err.message,
				tokenPassedIn: token,
			});
		req.user = user;
		next();
	});
};

export default authenticate;
