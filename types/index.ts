import {
	User,
	Room,
	RoomMembers,
} from '../backend/node_modules/generated/prisma';

declare global {
	namespace Express {
		interface Request {
			// TODO: type up user to be User object (from prisma generated table)
			user?: any;
		}
	}
}

export type ApiResponse<T> =
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			error: string;
	  };

export type RoomMembersWithRelations = RoomMembers & {
	user?: User;
	room?: Room;
};

export type UserWithRelations = User & {
	joinedRooms?: RoomMembersWithRelations[];
	createdRooms?: Room[];
	friendsList?: User[];
	friendsOf?: User[];
	blockedList?: User[];
	blockedBy?: User[];
	sentMessages?: MessageWithRelations[];
	receivedMessages?: MessageWithRelations[];
};

export type MessageWithRelations = Message & {
	sender?: User;
	recipient?: User;
	room?: Room;
};

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
	sender: UserWithRelations;
	recipient: UserWithRelations;
	read?: boolean;
	metadata?: MessageMetadata;
};

export type MessageMetadata = {};
