import { User, Message } from '../../../backend/node_modules/generated/prisma';
import { ApiResponse } from '../../../types';
import { v4 as uuidv4 } from 'uuid';

// const baseUrl = `http://localhost:${process.env.VITE_PORT || 5001}/api/user`;
const baseUrl = `http://localhost:${5001}/api`;

const register = async (
	username: User['username'],
	password: User['password'],
	email: User['email']
): Promise<
	ApiResponse<{ token: string; user: User & { messages: Message[] } }>
> => {
	const url = `${baseUrl}/user/signup`;
	const body: RequestInit['body'] = JSON.stringify({
		user: { id: uuidv4(), username, email, password },
	});
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');
	const options: RequestInit = { headers, body, method: 'POST' };

	try {
		const res = await fetch(url, options);
		const data: ApiResponse<{
			token: string;
			user: User & { messages: Message[] };
		}> = await res.json();
		if (!data.success) {
			console.log('the data is', data);
			throw new Error(data.error as string);
		}
		return { success: true, data: { ...data.data } };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : String(error),
		} as ApiResponse<{
			token: string;
			user: User & { messages: Message[] };
		}>;
	}
};

export default register;
