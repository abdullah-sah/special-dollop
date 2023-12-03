import {
	User,
	Message,
	Room,
} from '../../../backend/node_modules/generated/prisma';
import { ApiResponse } from '../../../types';

// const baseUrl = `http://localhost:${process.env.VITE_PORT || 5001}/api/user`;
const baseUrl = `http://localhost:${5001}/api`;

const signIn = async (
	username: User['username'],
	password: User['password']
): Promise<
	ApiResponse<{
		token: string;
		user: User & { messages: Message[]; joinedRooms: Room[] };
	}>
> => {
	const url = `${baseUrl}/user/signin`;
	const body: BodyInit = JSON.stringify({
		id: username,
		password,
	});
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');
	const options: RequestInit = { headers, body, method: 'POST' };

	try {
		const res = await fetch(url, options);
		const data: ApiResponse<{
			token: string;
			user: User & { messages: Message[]; joinedRooms: Room[] };
		}> = await res.json();
		if (!data.success) {
			console.log('the response for the signin was', data);
			throw new Error(data.error as string);
		}
		return { success: true, data: { ...data.data } };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : String(error),
		} as ApiResponse<{
			token: string;
			user: User & { messages: Message[]; joinedRooms: Room[] };
		}>;
	}
};

export default signIn;
