import { Request, Response, Router } from 'express';
import { PrismaClient, Room } from '@prisma/client';

const prisma = new PrismaClient();
const roomRouter = Router();

// get a room given a roomid
roomRouter.get('/:roomId', async (req: Request, res: Response) => {
	try {
		if (!req.params.roomId) {
			throw new Error('No "roomId" was passed as a parameter');
		}
		const response = await prisma.room.findUnique({
			where: { id: req.params.roomId },
			include: { members: true },
		});
		res.json({ success: true, response });
	} catch (err) {
		if (err instanceof Error) {
			res.json({ success: false, response: err.message });
		} else res.json({ success: false, response: err });
	}
});

// create a new room by passing in a room object in req.body
roomRouter.post('/', async (req: Request, res: Response) => {
	try {
		if (!req.body.room) {
			throw new Error('No "room" object was passed in the req.body');
		}
		const { room }: { room: Room } = req.body;
		const response = await prisma.room.create({ data: room });
		res.json({ success: true, response });
	} catch (err) {
		if (err instanceof Error) {
			res.json({ success: false, response: err.message });
		} else res.json({ success: false, response: err });
	}
});

// delete a room, passing in a roomId as a parameter
roomRouter.delete('/:roomId', async (req: Request, res: Response) => {
	try {
		if (!req.params.roomId) {
			throw new Error('No "roomId" was passed in as a parameter');
		}
		const response = await prisma.room.delete({
			where: { id: req.params.roomId },
		});
		res.json({ success: true, response });
	} catch (err) {
		if (err instanceof Error) {
			res.json({ success: false, response: err.message });
		} else res.json({ success: false, response: err });
	}
});

// update a room, by passing in an 'updatedRoom' object (of type Room) in req.body
roomRouter.put('/:roomId', async (req: Request, res: Response) => {
	try {
		if (!req.body.updatedRoom || !req.params.roomId) {
			throw new Error('No "updatedRoom" object was passed in the req.body');
		}
		const response = await prisma.room.update({
			where: { id: req.params.roomId },
			data: { ...req.body.updatedRoom },
		});
		res.json({ success: true, response });
	} catch (err) {
		if (err instanceof Error) {
			res.json({ success: false, response: err.message });
		} else res.json({ success: false, response: err });
	}
});

// add a user to a room (in other words – let a user join a room)
roomRouter.post(
	'/:roomId/add-user/:userId',
	async (req: Request, res: Response) => {
		try {
			if (!req.params.roomId || !req.params.userId) {
				throw new Error(
					`No ${
						req.params.roomId ? 'roomId' : 'userId'
					} was passed in as a paramter`
				);
			}
			const { roomId, userId } = req.params;
			const response = await prisma.roomMembers.create({
				data: {
					user: {
						connect: { id: userId },
					},
					room: {
						connect: { id: roomId },
					},
				},
			});
			res.json({ success: true, response });
		} catch (err) {
			if (err instanceof Error) {
				res.json({ success: false, response: err.message });
			} else res.json({ success: false, response: err });
		}
	}
);

// remove a user from a room
roomRouter.delete(
	'/:roomId/remove-user/:userId',
	async (req: Request, res: Response) => {
		try {
			if (!req.params.roomId || !req.params.userId) {
				throw new Error(
					`No ${
						req.params.roomId ? 'roomId' : 'userId'
					} was passed in as a paramter`
				);
			}
			const { roomId, userId } = req.params;
			const response = await prisma.roomMembers.delete({
				where: { userId_roomId: { roomId, userId } },
			});
			res.json({ success: true, response });
		} catch (err) {
			if (err instanceof Error) {
				res.json({ success: false, response: err.message });
			} else res.json({ success: false, response: err });
		}
	}
);

export default roomRouter;
