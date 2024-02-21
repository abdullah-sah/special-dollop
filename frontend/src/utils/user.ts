import { User } from '../../../backend/node_modules/generated/prisma';
import type { ApiResponse, UserWithRelations } from '../../../types';
import { v4 as uuidv4 } from 'uuid';

// const baseUrl = `http://localhost:${process.env.VITE_PORT || 5001}/api/user`;
const baseUrl = `http://localhost:${5001}/api`;

export const signUp = async (
	username: User['username'],
	password: User['password'],
	email: User['email']
	// TODO: pass in token parameter to enable auth middleware functionality
): Promise<
	ApiResponse<{
		token: string;
		user: UserWithRelations;
	}>
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
			user: UserWithRelations;
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
			user: UserWithRelations;
		}>;
	}
};

export const signIn = async (
	username: User['username'],
	password: User['password']
	// TODO: pass in token parameter to enable auth middleware functionality
): Promise<
	ApiResponse<{
		token: string;
		user: UserWithRelations;
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
			user: UserWithRelations;
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
			user: UserWithRelations;
		}>;
	}
};

// TODO: pass in token parameter to enable auth middleware functionality
// can pass in user id or username
export const getUser = async (userId: string) => {
	const url = `${baseUrl}/user/${userId}`;

	const options: RequestInit = { method: 'GET' };

	try {
		const res = await fetch(url, options);
		const data: ApiResponse<UserWithRelations> = await res.json();
		if (!data.success) {
			console.log(
				'there was an error with getUser, the response for getUser was',
				data
			);
			throw new Error(data.error as string);
		}
		return { success: true, data: { ...data.data } };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : String(error),
		} as ApiResponse<UserWithRelations>;
	}
};

export const searchForUser = async (searchTerm: string) => {
	const url = `${baseUrl}/user/search/${searchTerm}`;

	try {
		const res = await fetch(url);
		const data: ApiResponse<UserWithRelations[]> = await res.json();
		if (!data.success) {
			throw new Error(data.error as string);
		}
		return { success: true, data: data.data };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : String(error),
		} as ApiResponse<UserWithRelations[]>;
	}
};

export const addFriend = async (
	username: UserWithRelations['username'],
	friendName: UserWithRelations['username']
): Promise<ApiResponse<UserWithRelations>> => {
	try {
		const user = await getUser(username!);
		const friend = await getUser(friendName!);
		if (!user.success || !friend.success) {
			throw new Error(
				'could not fetch either the user or the friend from the database.'
			);
		}
		const url = `${baseUrl}/user/${user.data.id}/add-friend/${friend.data.id}`;
		console.log(url);
		const body: BodyInit = JSON.stringify({ ...user });
		const headers = new Headers();
		headers.append('Content-Type', 'application/json')
		const options: RequestInit = { body, headers, method: 'PUT' };

		const res = await fetch(url, options);
		const data: ApiResponse<UserWithRelations> = await res.json();
		if (!data.success) {
			throw new Error('there was an error with adding a friend to that user');
		}
		console.log('the data response from addFriend was: ', data);
		return { success: true, data: data.data};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : String(error),
		} as ApiResponse<UserWithRelations>;
	}
};
