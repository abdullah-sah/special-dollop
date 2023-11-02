import { RoomInput } from '../../../types';

const baseUrl = `http://localhost:${process.env.VITE_PORT || 5001}/api/room`;

export const joinRoom = async (userId: string, roomId: string) => {
	const url = `${baseUrl}/${roomId}/add-user/${userId}`;
	const res = await fetch(url, { method: 'POST' });
	const data = await res.json();
	return data;
};

export const leaveRoom = async (userId: string, roomId: string) => {
	const url = `${baseUrl}/${roomId}/remove-user/${userId}`;
	const res = await fetch(url, { method: 'DELETE' });
	const data = await res.json();
	return data;
};

export const createRoom = async (userId: string, room: RoomInput) => {
	const url = `${baseUrl}/`;
	const body: RequestInit['body'] = JSON.stringify({ userId, room });
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');
	const options: RequestInit = { headers, body, method: 'POST' };
	const res = await fetch(url, options);
	const roomMembersResponse = await joinRoom(userId, room.id);
	const roomResponse = await res.json();
	return { roomResponse, roomMembersResponse };
};
