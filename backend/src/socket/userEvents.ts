import { User } from '../../node_modules/generated/prisma';
import { ApiResponse } from '../../../types';

// const baseUrl = `http://localhost:${process.env.VITE_PORT || 5001}/api/user`;
const baseUrl = `http://localhost:${5001}/api`;

export const updateUserSocketId = async (
	userId: User['id'],
	newSocketId: string
) => {
	// console.log('the user id that was passed into me was', userId);
	const { response } = await getUser(userId, false, true);
	if (!(response instanceof Error)) {
		// console.log('the response id was ', response);
		const url = `${baseUrl}/user/${response.id}`;
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
	bySocket: boolean,
	basicUser?: boolean
) => {
		const url = `${baseUrl}/${bySocket ? 'socket' : 'user'}/${id}`;
		// console.log('the request url is', url);
		const res = await fetch(url, { method: 'GET'});
		const data: ApiResponse<User & { joinedRooms: User[] }> = await res.json();
		// console.log('the response that is being returned from the getUser function is', data);
		if (!(data.response instanceof Error) && basicUser) {
			const { joinedRooms, ...restOfData } = data.response;
			return { response: { ...restOfData } };
		}
		return data;
};

export const updateUser = async (updatedUser: User) => {
	const url = `${baseUrl}/user/${updatedUser.id}`;
	const body: RequestInit['body'] = JSON.stringify({ updatedUser });
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');
	const options: RequestInit = { headers, body, method: 'PUT' };
	const res = await fetch(url, options);
	return (await res.json()) as ApiResponse<User>;
};
