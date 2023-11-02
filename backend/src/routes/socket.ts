import {
	PrismaClient,
	User,
	Prisma,
} from '../../node_modules/generated/prisma';
import { Request, Response, Router } from 'express';

const prisma = new PrismaClient();
const socketRouter = Router();

socketRouter.get('/:socketId', async (req: Request, res: Response) => {
	try {
		if (!req.params.socketId) {
			throw new Error('No "socketId" passed in as a parameter');
		}
		const user = await prisma.user.findUnique({
			where: { socketId: req.params.socketId },
			include: { joinedRooms: true },
		});
		if (!user)
			throw new Error(
				`That user was not found: you passed in ${req.params.socketId} as the socketId`
			);
		res.json({ success: true, response: user });
	} catch (err) {
		if (err instanceof Error) {
			res.json({ success: false, response: err.message });
		} else res.json({ success: false, response: err });
	}
});

export default socketRouter;
