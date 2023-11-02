import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || randomUUID();

const authenticate = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) return res.sendStatus(401);

	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err)
			return res
				.status(403)
				.json({
					success: false,
					message: err.message,
					token,
					expectedToken: JWT_SECRET,
				});
		req.user = user;
		next();
	});
};

export default authenticate;
