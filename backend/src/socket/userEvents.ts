import { User, Message } from '../../node_modules/generated/prisma';
import { ApiResponse, UserWithRelations } from '../../../types';
import { v4 as uuidv4 } from 'uuid';

// const baseUrl = `http://localhost:${process.env.VITE_PORT || 5001}/api/user`;
const baseUrl = `http://localhost:${5001}/api`;

export const updateUserSocketId = async (
	userId: User['id'],
	newSocketId: string
) => {
	// console.log('the user id that was passed into me was', userId);
	const response = await getUser(userId, false);
	if (response.success) {
		// console.log('the response id was ', response);
		const user = response.data;
		const url = `${baseUrl}/user/${user.id}`;
		const body: BodyInit = JSON.stringify({
			updatedUser: { ...response, socketId: newSocketId },
		});
		// console.log('this is the body that is sent to the server', response);
		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
		const options: RequestInit = { headers, body, method: 'PUT' };
		const res = await fetch(url, options);
		const data = await res.json();
		// console.log('this is the response from the updateUserSocketId function', data);
		return data;
	} else {
		return new Error(`couldn't update that user`);
	}
};

export const getUser = async (
	id: User['id' | 'socketId'],
	bySocket: boolean
): Promise<ApiResponse<User>> => {
	const url = `${baseUrl}/${bySocket ? 'socket' : 'user'}/${id}`;
	// console.log('the request url is', url);
	try {
		const res = await fetch(url, { method: 'GET' });
		const data: ApiResponse<UserWithRelations> = await res.json();
		if (!data.success) {
			throw new Error(data.error as unknown as string);
		}
		// console.log('the response that is being returned from the getUser function is', data);
		return data;
	} catch (error) {
		return { success: false, error: error as string };
	}
};

export const updateUser = async (updatedUser: User) => {
	const url = `${baseUrl}/user/${updatedUser.id}`;
	const body: RequestInit['body'] = JSON.stringify({ updatedUser });
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');
	const options: RequestInit = { headers, body, method: 'PUT' };
	try {
		const res = await fetch(url, options);
		const data: ApiResponse<User> = await res.json();
		if (!data.success) {
			throw new Error(data.error);
		}
		return (await res.json()) as ApiResponse<User>;
	} catch (error) {
		return {
			success: false,
			response: error instanceof Error ? error.message : String(error),
		};
	}
};