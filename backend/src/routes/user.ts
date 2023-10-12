import { PrismaClient, User } from '@prisma/client';
import { Request, Response, Router } from 'express';

const prisma = new PrismaClient();
const userRouter = Router();

// get a user given a userId
userRouter.get('/:userId', async (req: Request, res: Response) => {
	try {
		if (!req.params.userId) {
			throw new Error('No "userId" passed in as a parameter');
		}
		const user = await prisma.user.findUnique({
			where: { id: req.params.userId },
			include: { joinedRooms: true },
		});
		if (!user) throw new Error('That user was not found');
		res.json({ success: true, response: user });
	} catch (err) {
		if (err instanceof Error) {
			res.json({ success: false, response: err.message });
		} else res.json({ success: false, response: err });
	}
});

// create a new user by passing in a user object (type User) in req.body
userRouter.post('/', async (req: Request, res: Response) => {
	try {
		if (!req.body.user) {
			throw new Error('No "user" object passed in req.body');
		}
		const { user }: { user: User } = req.body;
		await prisma.user.create({ data: user });
		res.json({ success: true });
	} catch (err) {
		if (err instanceof Error) {
			res.json({ success: false, response: err.message });
		} else res.json({ success: false, response: err });
	}
});

// delete a user, passing in userId as a parameter
userRouter.delete('/:userId', async (req: Request, res: Response) => {
	try {
		await prisma.user.delete({ where: { id: req.params.userId } });
		res.json({ success: true });
	} catch (err) {
		if (err instanceof Error) {
			res.json({ success: false, response: err.message });
		} else res.json({ success: false, response: err });
	}
});

// update a user, passing in an 'updatedUser' object in req.body, and a userId as a paramater
userRouter.put('/:userId', async (req: Request, res: Response) => {
	try {
		if (!req.body.updatedUser || !req.params.userId) {
			throw new Error('No "updatedUser" object was passed in the req.body');
		}
		const response = await prisma.user.update({
			where: { id: req.params.userId },
			data: { ...req.body.updatedUser },
		});
		res.json({ success: true, response });
	} catch (err) {
		if (err instanceof Error) {
			res.json({ success: false, response: err.message });
		} else res.json({ success: false, response: err });
	}
});

export default userRouter;
