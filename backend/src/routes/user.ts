import { PrismaClient, User } from '../../node_modules/generated/prisma';
import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/auth';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const userRouter = Router();

// get all existing users
userRouter.get('/', async (req: Request, res: Response) => {
	try {
		const response = await prisma.user.findMany({
			include: { joinedRooms: true },
		});
		res.json({ success: true, response });
	} catch (err) {
		if (err instanceof Error) {
			res.json({ success: false, response: err.message });
		} else res.json({ success: false, response: err });
	}
});

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
		if (!user)
			throw new Error(
				`That user was not found: you passed in ${req.params.userId} as the userId`
			);
		res.json({ success: true, response: user });
	} catch (err) {
		if (err instanceof Error) {
			res.json({ success: false, response: err.message });
		} else res.json({ success: false, response: err });
	}
});

// create a new user by passing in a user object (type User) in req.body
userRouter.post('/signup', async (req: Request, res: Response) => {
	try {
		// validating input
		if (!req.body.user || !req.body.user.password) {
			throw new Error('No "user" object passed in req.body');
		}
		const { user }: { user: User } = req.body;
		const hashedPassword = await bcrypt.hash(user.password!, 10);
		await prisma.user.create({ data: { ...user, password: hashedPassword } });
		const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
			expiresIn: '2 days',
		});
		res.status(201).json({ success: true, token });
	} catch (err) {
		if (err instanceof Error) {
			res.status(400).json({ success: false, response: err.message });
		} else res.status(400).json({ success: false, response: err });
	}
});

userRouter.post('/signin', async (req: Request, res: Response) => {
	const { id, password } = req.body;
	if (!id || !password) {
		throw new Error('Username and password are required in request.body');
	}

	try {
		const user = await prisma.user.findUnique({ where: { id } });

		if (!user) throw new Error(`The user with an id of ${id} was not found`);

		const isPasswordValid = await bcrypt.compare(password, user.password!);
		if (!isPasswordValid) throw new Error('Invalid credentials');
		const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
			expiresIn: '2 days',
		});
		res.json({ success: true, token });
	} catch (err) {
		if (err instanceof Error) {
			res.status(401).json({ success: false, response: err.message });
		} else res.status(401).json({ success: false, response: err });
	}
});

userRouter.post('/signout', async (req: Request, res: Response) => {
	res.clearCookie('token');
	res.send('Signed out');
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
			const causeOfErr = !req.body.updatedUser ? 'updatedUser' : 'userId';
			throw new Error(
				`No "${causeOfErr}" was passed in to req.body or req.params, instead ${
					causeOfErr == 'updatedUser'
						? req.body[causeOfErr]
						: req.params[causeOfErr]
				} was passed`
			);
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
