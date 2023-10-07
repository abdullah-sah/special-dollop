import { genSalt, hash } from 'bcrypt';
import { User } from '../../types';
import { PutItemCommandInput, AttributeValue } from '@aws-sdk/client-dynamodb';

export const generateHash = async (password: string) => {
	return genSalt().then((salt) =>
		hash(password, salt).then((passwordHash) => passwordHash)
	);
};

export const mapToDbRequest = (user: User): PutItemCommandInput => {
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

export const mapArrayToDbList = (value: string[]): AttributeValue['L'] => {
	return value.map((item) => {
		return { S: item };
	});
};
