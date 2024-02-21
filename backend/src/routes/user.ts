import { PrismaClient, User } from '../../node_modules/generated/prisma';
import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/auth';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const userRouter = Router();

// get a user given a userId or username
userRouter.get('/:userId', async (req: Request, res: Response) => {
	try {
		if (!req.params.userId) {
			throw new Error('No userId or username passed in as a parameter');
		}
		let user = await prisma.user.findUnique({
			where: { id: req.params.userId },
			include: {
				sentMessages: true,
				receivedMessages: true,
				joinedRooms: { include: { room: true, user: true } },
				friendsList: true,
				createdRooms: true,
			},
		});
		if (!user) {
			user = await prisma.user.findUnique({
				where: { username: req.params.userId },
				include: {
					sentMessages: true,
					receivedMessages: true,
					joinedRooms: { include: { room: true, user: true } },
					friendsList: true,
					createdRooms: true,
				},
			});

			if (!user)
				throw new Error(
					`That user was not found: you passed in ${req.params.userId} as the userId/username`
				);
		}
		const { password, ...restOfUser } = user;
		res.json({ success: true, data: { ...restOfUser } });
	} catch (err) {
		if (err instanceof Error) {
			res.json({ success: false, response: err.message });
		} else res.json({ success: false, response: err });
	}
});

// search for a user based on their username
userRouter.get('/search/:searchTerm', async (req: Request, res: Response) => {
	try {
		if (!req.params.searchTerm) {
			throw new Error('Must pass in search term as param');
		}

		const users = await prisma.user.findMany({
			where: {
				username: {
					contains: req.params.searchTerm,
				},
			},
			include: {
				sentMessages: true,
				receivedMessages: true,
				joinedRooms: { include: { room: true, user: true } },
				friendsList: true,
				createdRooms: true,
			},
		});

		if (!users || users.length === 0) {
			return res.status(404).json({
				success: false,
				response: `No users found matching the search term ${req.params.searchTerm}`,
			});
		}

		const usersWithoutPasswords = users.map((user) => {
			const { password, ...restOfUser } = user;
			return { ...restOfUser };
		});

		res.json({ success: true, data: usersWithoutPasswords });
	} catch (err) {
		if (err instanceof Error) {
			res.status(400).json({ success: false, response: err.message });
		} else res.status(400).json({ success: false, response: err });
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
		const newUser = await prisma.user.create({
			data: { ...user, password: hashedPassword },
			include: {
				sentMessages: true,
				receivedMessages: true,
				joinedRooms: { include: { room: true, user: true } },
				friendsList: true,
				createdRooms: true,
			},
		});
		const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
			expiresIn: '2 days',
		});
		const { password, ...restOfUser } = newUser;
		res
			.status(201)
			.json({ success: true, data: { token, user: { ...restOfUser } } });
	} catch (err) {
		if (err instanceof Error) {
			res.status(400).json({ success: false, response: err.message });
		} else res.status(400).json({ success: false, response: err });
	}
});

userRouter.post('/signin', async (req: Request, res: Response) => {
	const { id, password } = req.body;

	try {
		if (!id || !password) {
			throw new Error('users id and password are required in request.body');
		}
		let user = await prisma.user.findUnique({
			where: { id },
			include: {
				sentMessages: true,
				receivedMessages: true,
				joinedRooms: { include: { room: true, user: true } },
				friendsList: true,
				createdRooms: true,
			},
		});

		if (!user) {
			user = await prisma.user.findUnique({
				where: { username: id },
				include: {
					sentMessages: true,
					receivedMessages: true,
					joinedRooms: { include: { room: true, user: true } },
					friendsList: true,
					createdRooms: true,
				},
			});
			if (!user) throw new Error(`Couldn't find that user`);
		}

		const isPasswordValid = await bcrypt.compare(password, user.password!);
		if (!isPasswordValid) throw new Error('Invalid credentials');
		const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
			expiresIn: '2 days',
		});
		const { password: userPassword, ...restOfUser } = user;
		res.json({ success: true, data: { token, user: { ...restOfUser } } });
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
		const user = await prisma.user.update({
			where: { id: req.params.userId },
			data: { ...req.body.updatedUser },
			include: {
				sentMessages: true,
				receivedMessages: true,
				joinedRooms: { include: { room: true, user: true } },
				friendsList: true,
				createdRooms: true,
			},
		});
		const { password, ...restOfUser } = user;
		res.json({ success: true, data: { ...restOfUser } });
	} catch (err) {
		if (err instanceof Error) {
			res.json({ success: false, response: err.message });
		} else res.json({ success: false, response: err });
	}
});

userRouter.put(
	'/:userId/add-friend/:friendId',
	async (req: Request, res: Response) => {
		try {
			const user = await prisma.user.update({
				where: { id: req.params.userId },
				data: { friendsList: { connect: { id: req.params.friendId } } },
				include: {
					sentMessages: true,
					receivedMessages: true,
					joinedRooms: { include: { room: true, user: true } },
					friendsList: true,
					createdRooms: true,
				},
			});

			res.json({ success: true, data: user });
		} catch (err) {
			if (err instanceof Error) {
				res.json({ success: false, response: err.message });
			} else res.json({ success: false, response: err });
		}
	}
);

export default userRouter;
