import express from 'express';
import { randomUUID } from 'crypto';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { ClientToServerEvents, ServerToClientEvents, User } from '../../types';
import chatEvents from './socket/chatEvents';
import {
	addNewUser,
	getUser,
	getUserByUsername,
	testDbConfig,
	updateUser,
} from './db';
import { generateHash } from '../utils';

const cors = require('cors');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
	cors: {
		origin: `http://localhost:5173`,
		methods: ['GET', 'POST'],
	},
});
testDbConfig();

const user = {
	id: randomUUID(),
	username: 'test user',
	email: 'letestemail@gmail.com',
	fullname: 'Barry Stevens',
	displayname: 'minion0123567',
	online: false,
} as User;

(async () => {
	const hash = await generateHash('testpasswrdd');
	await addNewUser(
		user.username,
		hash,
		user.email,
		user.fullname,
		user.displayname
	);
	const res = await getUserByUsername(user.username);
	console.log(res);
})();

generateHash('testpassword').then((hash) => console.log(hash));

io.on('connection', chatEvents);

server.listen(process.env.VITE_PORT, () => {
	console.log(`Listening on port ${process.env.VITE_PORT}`);
});
