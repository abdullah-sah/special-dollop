import { genSalt, hash } from 'bcrypt';
import { Room, User } from '../../types';
import { PutItemCommandInput, AttributeValue } from '@aws-sdk/client-dynamodb';

export const generateHash = async (password: string) => {
	return genSalt().then((salt) =>
		hash(password, salt).then((passwordHash) => passwordHash)
	);
};

export const mapToUserDbRequest = (user: User): PutItemCommandInput => {
	return {
		TableName: 'Users',
		Item: {
			UserId: {
				S: user.id,
			},
			Username: {
				S: user.username,
			},
			Password: {
				S: user.password,
			},
			DisplayName: {
				S: user.displayname,
			},
			Email: {
				S: user.email,
			},
			FriendsList: {
				L: user.friendsList.map((friend) => {
					return { S: friend };
				}),
			},
			BlockedList: {
				L: user.friendsList.map((friend) => {
					return { S: friend };
				}),
			},
			JoinedRooms: {
				L: user.joinedRooms.map((room) => {
					return { S: room };
				}),
			},
			Online: {
				BOOL: user.online,
			},
			LastSeen: {
				S: user.lastSeen,
			},
			FullName: {
				S: user.fullname,
			},
			ProfilePicture: {
				B: new TextEncoder().encode(user.profilePicture),
			},
		},
	};
};

export const mapToRoomDbRequest = (room: Room): PutItemCommandInput => {
	return {
		TableName: 'Rooms',
		Item: {
			RoomId: {
				S: room.id,
			},
			Name: {
				S: room.name,
			},
			Description: {
				S: room.description,
			},
			CreatedBy: {
				S: room.createdBy,
			},
			CreatedAt: {
				S: room.createdAt,
			},
			Members: {
				L: room.members.map((member) => {
					return { S: member };
				}),
			},
			IsPrivate: {
				BOOL: room.isPrivate,
			},
		},
	};
};

export const mapArrayToDbList = (value: string[]): AttributeValue['L'] => {
	return value.map((item) => {
		return { S: item };
	});
};

export const capitaliseFirstLetter = (string: string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};
