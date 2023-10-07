import {
	DeleteBackupCommandOutput,
	DeleteItemCommand,
	DeleteItemCommandInput,
	DynamoDBClient,
	ListTablesCommand,
	PutItemCommand,
	PutItemCommandInput,
	PutItemCommandOutput,
	QueryCommand,
	QueryCommandInput,
	QueryCommandOutput,
	ScanCommand,
	ScanCommandInput,
	ScanCommandOutput,
	UpdateItemCommand,
	UpdateItemCommandInput,
	UpdateItemCommandOutput,
} from '@aws-sdk/client-dynamodb';
import { randomUUID } from 'crypto';
import {
	User,
	UserAttributeMappings,
	UpdateAttributes,
	DBResponse,
} from '../../../../types';
import { mapToUserDbRequest, mapArrayToDbList } from '../../../utils';

const client = new DynamoDBClient({ region: 'eu-north-1' });
const command = new ListTablesCommand({});
const TableName = 'Users';

export const testDbConfig = async () => {
	try {
		const results = await client.send(command);
		console.log(results.TableNames?.join('\n'));
	} catch (err) {
		console.error(err);
	}
};

export const addNewUser = async (
	username: User['username'],
	password: User['password'],
	email: User['email'],
	fullname: User['fullname'],
	displayname: User['displayname']
): Promise<DBResponse<PutItemCommandOutput, User>> => {
	const user: User = {
		username,
		password,
		displayname,
		email,
		fullname,
		id: randomUUID(),
		blockedList: [],
		friendsList: [],
		joinedRooms: [],
		lastSeen: Date().toString(),
		profilePicture: '',
		online: false,
	};

	try {
		const input: PutItemCommandInput = mapToUserDbRequest(user);

		const putItemCommand = new PutItemCommand(input);
		const response = await client.send(putItemCommand);
		return { response, additionalData: { ...user, password: '' } };
	} catch (err) {
		return err as Error;
	}
};

export const getUser = async (
	user: User
): Promise<DBResponse<QueryCommandOutput, User>> => {
	try {
		const input: QueryCommandInput = {
			TableName,
			KeyConditionExpression: `UserId = :pkValue AND Username = :skValue`,
			ExpressionAttributeValues: {
				':pkValue': { S: user.id },
				':skValue': { S: user.username },
			},
		};

		const queryCommand = new QueryCommand(input);
		const response = await client.send(queryCommand);
		return { response };
	} catch (err) {
		return err as Error;
	}
};

export const getUserByUsername = async (
	username: User['username']
): Promise<DBResponse<ScanCommandOutput, User>> => {
	const input: ScanCommandInput = {
		TableName,
		FilterExpression: '#Username = :username',
		ExpressionAttributeNames: {
			'#Username': 'Username',
		},
		ExpressionAttributeValues: {
			':username': { S: username },
		},
	};

	try {
		const command = new ScanCommand(input);
		const response = await client.send(command);
		return { response };
	} catch (err) {
		return err as Error;
	}
};

export const updateUser = async (
	user: User,
	args: UpdateAttributes<UserAttributeMappings, keyof UserAttributeMappings>
): Promise<DBResponse<UpdateItemCommandOutput, User>> => {
	const expressionAttributeNames: UpdateItemCommandInput['ExpressionAttributeNames'] =
		{};
	const expressionAttributeValues: UpdateItemCommandInput['ExpressionAttributeValues'] =
		{};

	try {
		Object.entries(args).forEach(([key, value], i) => {
			const attributeName = `#attribute${i + 1}`;
			const attributeValue =
				typeof value === 'string'
					? { S: value }
					: typeof value === 'boolean'
					? { BOOL: value }
					: value === null
					? { NULL: true }
					: Array.isArray(value)
					? { L: mapArrayToDbList(value)! }
					: undefined;

			if (attributeValue !== undefined) {
				expressionAttributeNames[attributeName] = key;
				expressionAttributeValues[`:value${i + 1}`] = attributeValue;
			}
		});

		const updateExpression: UpdateItemCommandInput['UpdateExpression'] = `SET ${Object.entries(
			args
		)
			.map((_, i) => `#attribute${i + 1} = :value${i + 1}`)
			.join(', ')}`;

		const input: UpdateItemCommandInput = {
			TableName,
			Key: {
				UserId: { S: user.id },
				Username: { S: user.username },
			},
			UpdateExpression: updateExpression,
			ExpressionAttributeNames: expressionAttributeNames,
			ExpressionAttributeValues: expressionAttributeValues,
		};

		const updateCommand = new UpdateItemCommand(input);
		const response = await client.send(updateCommand);
		return { response };
	} catch (err) {
		return err as Error;
	}
};

export const deleteUser = async (
	id: User['id'],
	username: User['username']
): Promise<DBResponse<DeleteBackupCommandOutput, User>> => {
	const input: DeleteItemCommandInput = {
		TableName,
		Key: {
			UserId: { S: id },
			Username: { S: username },
		},
		ReturnValues: 'ALL_OLD',
	};

	const deleteCommand = new DeleteItemCommand(input);
	const response = await client.send(deleteCommand);
	return { response };
};
