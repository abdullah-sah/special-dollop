import { Request, Response, Router } from 'express';
import {
	Prisma,
	PrismaClient,
	Message,
	User,
	Room,
} from '../../node_modules/generated/prisma';

const prisma = new PrismaClient();
const chatRouter = Router();

// create a new message from a user to a room
// pass in a user, room, and content in the req.body
chatRouter.post('/room', async (req: Request, res: Response) => {
	const {
		sender,
		room,
		content,
	}: { sender: User; room: Room; content: Message['content'] } = req.body;
	try {
		if (!sender || !room || !content) {
			throw new Error('Must pass in valid sender, room, and content');
		}

		const response = await prisma.message.create({
			data: {
				content,
				sender: { connect: { id: sender.id } },
				room: { connect: { id: room.id } },
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			include: { recipient: true, room: true, sender: true },
		});

		res.json({ success: true, response });
	} catch (err) {
		if (err instanceof Error) {
			res.status(404).json({ success: false, response: err.message });
		} else res.status(404).json({ success: false, response: err });
	}
});

// create a message from a user to another user
// pass in a sender (user), recipient (user), content
chatRouter.post('/user', async (req: Request, res: Response) => {
	const {
		sender,
		recipient,
		content,
	}: { sender: User; recipient: User; content: Message['content'] } = req.body;
	try {
		if (!sender || !recipient || !content) {
			throw new Error('Must pass in valid sender, recipient, and content');
		}

		const response = await prisma.message.create({
			data: {
				content,
				sender: { connect: { id: sender.id } },
				recipient: { connect: { id: recipient.id } },
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			},
			include: { recipient: true, room: true, sender: true },
		});

		res.json({ success: true, data: { ...response } });
	} catch (err) {
		if (err instanceof Error) {
			res.status(404).json({ success: false, response: err.message });
		} else res.status(404).json({ success: false, response: err });
	}
});

// update an existing message by passing a messageId & content in req.body
chatRouter.put('/', async (req: Request, res: Response) => {
	const { id, content }: { id: Message['id']; content: Message['content'] } =
		req.body;

	try {
		if (!id || !content) {
			throw new Error('Must pass in a valid id (for the message) and content');
		}

		const response = await prisma.message.update({
			where: { id },
			data: { content, updatedAt: new Date().toISOString() },
			include: { recipient: true, room: true, sender: true },
		});

		res.json({ success: true, response });
	} catch (err) {
		if (err instanceof Error) {
			res.status(403).json({ success: false, response: err.message });
		} else res.status(403).json({ success: false, response: err });
	}
});

// delete a message by passing in an id as a param
chatRouter.delete('/:id', async (req: Request, res: Response) => {
	try {
		const response = await prisma.message.delete({
			where: { id: req.params.id },
		});
		res.json({ success: true, response });
	} catch (err) {
		if (err instanceof Error) {
			res.status(404).json({ success: false, response: err.message });
		} else res.status(404).json({ success: false, response: err });
	}
});

// find message by passing messageId as param
chatRouter.get('/:messageId', async (req: Request, res: Response) => {
	try {
		const response = await prisma.message.findUnique({
			where: { id: req.params.messageId },
			include: { room: true, sender: true, recipient: true },
		});

		if (!response)
			throw new Error(`Couldn't find message with id: ${req.params.messageId}`);

		res.json({ success: true, response });
	} catch (err) {
		if (err instanceof Error) {
			res.status(404).json({ success: false, response: err.message });
		} else res.status(404).json({ success: false, response: err });
	}
});

export default chatRouter;
