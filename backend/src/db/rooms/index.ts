import { randomUUID } from 'crypto';
import {
	DeleteItemCommand,
	DeleteItemCommandInput,
	DeleteItemCommandOutput,
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
import {
	DBResponse,
	Room,
	RoomUpdateAttributes,
	UpdateAttributes,
} from '../../../../types';
import {
	capitaliseFirstLetter,
	mapArrayToDbList,
	mapToRoomDbRequest,
} from '../../../utils';

const client = new DynamoDBClient({ region: 'eu-north-1' });
const command = new ListTablesCommand({});
const TableName = 'Rooms';

export const addNewRoom = async (
	name: Room['name'],
	description: Room['description'],
	createdBy: Room['createdBy'],
	members: Room['members'],
	isPrivate: boolean
): Promise<DBResponse<PutItemCommandOutput, Room>> => {
	const room: Room = {
		id: randomUUID(),
		name,
		description,
		createdBy,
		createdAt: new Date().toString(),
		members,
		isPrivate,
	};

	try {
		const input: PutItemCommandInput = mapToRoomDbRequest(room);
		const putItemCommand = new PutItemCommand(input);
		const response = await client.send(putItemCommand);
		return { response, additionalData: room };
	} catch (err) {
		return err as Error;
	}
};

export const getRoom = async (
	id: Room['id']
): Promise<DBResponse<QueryCommandOutput, Room>> => {
	const input: QueryCommandInput = {
		TableName,
		KeyConditionExpression: `RoomId = :pkValue`,
		ExpressionAttributeValues: {
			':pkValue': { S: id },
		},
	};
	try {
		const queryCommand = new QueryCommand(input);
		const response = await client.send(queryCommand);
		return { response };
	} catch (err) {
		return err as Error;
	}
};

export const getRoomByName = async (
	name: Room['name']
): Promise<DBResponse<ScanCommandOutput, Room>> => {
	const input: ScanCommandInput = {
		TableName,
		FilterExpression: '#Name = :name',
		ExpressionAttributeNames: {
			'#Name': 'Name',
		},
		ExpressionAttributeValues: {
			':name': { S: name },
		},
	};

	try {
		const scanCommand = new ScanCommand(input);
		const response = await client.send(scanCommand);
		return { response };
	} catch (err) {
		return err as Error;
	}
};

export const updateRoom = async (
	id: Room['id'],
	name: Room['name'],
	attributes: UpdateAttributes<RoomUpdateAttributes, keyof RoomUpdateAttributes>
): Promise<DBResponse<UpdateItemCommandOutput, Room>> => {
	const expressionAttributeNames: UpdateItemCommandInput['ExpressionAttributeNames'] =
		{};
	const expressionAttributeValues: UpdateItemCommandInput['ExpressionAttributeValues'] =
		{};

	try {
		Object.entries(attributes).forEach(([key, value], i) => {
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

			if (attributeValue != undefined) {
				expressionAttributeNames[attributeName] = capitaliseFirstLetter(key);
				expressionAttributeValues[`:value${i + 1}`] = attributeValue;
			}
		});

		const updateExpression: UpdateItemCommandInput['UpdateExpression'] = `SET ${Object.entries(
			attributes
		)
			.map((_, i) => `#attribute${i + 1} = :value${i + 1}`)
			.join(', ')}`;

		const input: UpdateItemCommandInput = {
			TableName,
			Key: {
				RoomId: { S: id },
				Name: { S: name },
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

export const deleteRoom = async (
	id: Room['id'],
	name: Room['name']
): Promise<DBResponse<DeleteItemCommandOutput, Room>> => {
	const input: DeleteItemCommandInput = {
		TableName,
		Key: {
			RoomId: { S: id },
			Name: { S: name },
		},
		ReturnValues: 'ALL_OLD',
	};

	const deleteCommand = new DeleteItemCommand(input);
	const response = await client.send(deleteCommand);
	return { response };
};
