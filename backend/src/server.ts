import express from 'express';
import http from 'http';
import path from 'path';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import { ClientToServerEvents, ServerToClientEvents } from '../../types';
import '../../types'; // needed to make sure that the Express Request type is updated based on the augmentation in ../../types
import chatRouter from './routes/chat';
import userRouter from './routes/user';
import roomRouter from './routes/room';
import { createRoom, joinRoom, leaveRoom } from './socket/roomEvents';
import { getUser, updateUserSocketId } from './socket/userEvents';
import socketRouter from './routes/socket';
import authenticate from './middleware/auth';

const cors = require('cors');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
app.use(cors(), express.json());

app.use('/api/user', authenticate, userRouter);
app.use('/api/room', authenticate, roomRouter);
app.use('/api/chat', chatRouter);
app.use('/api/socket', authenticate, socketRouter);

const server = http.createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
	cors: {
		origin: `http://localhost:5173`,
		methods: ['GET', 'POST'],
	},
});

io.on(
	'connection',
	(socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
		socket.on('auth', async (userId) => {
			await updateUserSocketId(userId, socket.id);
		});

		socket.on('join_room', async (userId, roomId) => {
			let response;
			response = await joinRoom(userId, roomId);
			return response;
		});

		socket.on('leave_room', async (userId, roomId) => {
			const response = await leaveRoom(userId, roomId);
		});

		socket.on('create_and_join_room', async (userId, room) => {
			const response = await createRoom(userId, room);
		});

		socket.on('private_message', async (recipientUserId, message) => {
			const { response } = await getUser(recipientUserId, false);
			if (!(response instanceof Error) && response.socketId) {
				console.log(
					'the response socket id in question is indeed',
					response.socketId
				);
				console.log('while the socket id is in fact', socket.id);
				io.to(response.socketId).emit('receive_message', {
					message,
					senderId: socket.id,
					__createdtime__: new Date().toDateString(),
				});
			} else {
				console.log('the response is as follows, ', response);
			}
		});

		socket.on('disconnect', () => {
			console.log('socket number', socket.id, 'has disconnected');
		});
	}
);

server.listen(process.env.VITE_PORT, () => {
	console.log(`Listening on port ${process.env.VITE_PORT}`);
});
