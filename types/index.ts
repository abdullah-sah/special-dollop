export type DBResponse<T, K> =
	| {
			response: T;
			additionalData?: K;
	  }
	| Error;

export type DBAttribute =
	| 'UserId'
	| 'Username'
	| 'BlockedList'
	| 'DisplayName'
	| 'Email'
	| 'FriendsList'
	| 'FullName'
	| 'JoinedRooms'
	| 'LastSeen'
	| 'Online'
	| 'ProfilePicture';

export type UpdateAttributes<T, K extends keyof T> = {
	[P in K]?: T[P];
};

export type UserAttributeMappings = {
	UserId: User['id'];
	Username: User['username'];
	BlockedList: User['blockedList'];
	DisplayName: User['displayname'];
	Email: User['email'];
	FriendsList: User['friendsList'];
	FullName: User['fullname'];
	JoinedRooms: User['joinedRooms'];
	LastSeen: User['lastSeen'];
	Online: User['online'];
	ProfilePicture: User['profilePicture'];
};

export interface ServerToClientEvents {
	kicked_user: (data: User) => void;
	receive_message: (data: ReceiveMessage) => void;
}
export interface ClientToServerEvents {
	join_room: (user: User, room: Room['id']) => void;
	leave_room: (user: User, room: Room['id']) => void;
}

export type ReceiveMessage = {
	message: string;
	username: string;
	__createdtime__: string;
};

export type User = {
	id: string;
	username: string;
	displayname: string;
	password: string;
	email: string;
	friendsList: User[];
	blockedList: User[];
	joinedRooms: Room[];
	online: boolean;
	lastSeen: string;
	fullname: string;
	profilePicture: string;
	location?: string;
	preferences?: UserPreferences;
	socials?: SocialLink;
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

export type Room = {
	id: string;
	createdBy: User['username'];
	createdAt: string;
	name: string;
	description: string;
	members: User['id'][] | User['username'][];
	isPrivate: boolean;
	typingUsers?: User[];
};

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
