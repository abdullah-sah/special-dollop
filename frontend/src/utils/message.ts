import { User } from '../../../backend/node_modules/generated/prisma';
import type { ApiResponse, MessageWithRelations } from '../../../types';
import { v4 as uuidv4 } from 'uuid';
import { getUser } from './user';

// const baseUrl = `http://localhost:${process.env.VITE_PORT || 5001}/api/user`;
const baseUrl = `http://localhost:${5001}/api`;

export const sendMessageToUser = async (
	sender: User,
	recipientId: User['id'] | User['username'],
	content: MessageWithRelations['content']
) => {
	const url = `${baseUrl}/chat/user`;
	const recipient = await getUser(recipientId!);

	try {
		console.log('the recipient was', recipient);
		console.log('the sender was', sender);
		if (!recipient.success) {
			throw new Error(
				'couldnt find the recipient user, make sure the userid or username youre passing is correct'
			);
		}
		const body: BodyInit = JSON.stringify({
			sender,
			recipient: recipient.data,
			content,
		});
		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
		const options: RequestInit = { headers, body, method: 'POST' };
		const res = await fetch(url, options);
		const data: ApiResponse<MessageWithRelations> = await res.json();
		if (!data.success) {
			console.log('there was an error sending a message to the user', data);
			throw new Error(data.error as string);
		}
		return { success: true, data: { ...data.data } };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : String(error),
		} as ApiResponse<MessageWithRelations>;
	}
};
