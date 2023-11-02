import {
	User,
	Room,
	RoomMembers,
} from '../backend/node_modules/generated/prisma';

export type ApiResponse<T> = {
	success: boolean;
	response: T | Error;
};

declare global {
	namespace Express {
		interface Request {
			// TODO: type up user to be User object (from prisma generated table)
			user?: any;
		}
	}
}

export interface ServerToClientEvents {
	kicked_user: (data: User) => void;
	receive_message: (data: ReceiveMessage) => void;
}
export interface ClientToServerEvents {
	auth: (userId: User['id']) => void;
	user_disconnect: () => void;
	join_room: (userId: User['id'], room: Room['id']) => void;
	leave_room: (userId: User['id'], room: Room['id']) => void;
	create_and_join_room: (userId: User['id'], room: RoomInput) => void;
	private_message: (recipientId: User['id'], message: string) => void;
}

export type ReceiveMessage = {
	message: string;
	senderId: string;
	__createdtime__: string;
};

export type RoomInput = Omit<Room, 'userId'> & {
	createdBy?: User;
	members?: RoomMembers[];
};

export type UserPreferences = {
	theme: string;
	language: string;
};

export type SocialLink = Partial<Record<SocialPlatform, string>>;

export type SocialPlatform =
	| 'facebook'
	| 'twitter'
	| 'github'
	| 'discord'
	| 'snapchat'
	| 'instagram';

// export type Room = {
// 	id: string;
// 	createdBy: User['username'];
// 	createdAt: string;
// 	name: string;
// 	description: string;
// 	members: User['id'][] | User['username'][];
// 	isPrivate: boolean;
// 	typingUsers?: User[];
// };

export type Message = {
	id: string;
	content: string;
	timestamp: string;
	sender: User;
	recipient: User | Room;
	read?: boolean;
	metadata?: MessageMetadata;
};

export type MessageMetadata = {};
