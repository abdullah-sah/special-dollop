import { PrismaClient, Room } from '../../node_modules/generated/prisma';
import { getUser } from './userEvents';

const prisma = new PrismaClient();

export const createMessage = async (
	message: string,
	socketId: string,
	roomId?: Room['id']
) => {
	try {
		const { response } = await getUser(socketId, true, true);
		if (response instanceof Error) throw new Error(response.message);
		const newMessage = await prisma.message.create({
			data: {
				content: message,
				createdAt: new Date().toISOString(),
				userId: response.id,
				roomId: roomId ?? 'N/A',
			},
		});
		return newMessage;
	} catch (err) {
		if (err instanceof Error) {
			return { success: false, error: err.message };
		} else return { success: false, error: err };
	}
};
