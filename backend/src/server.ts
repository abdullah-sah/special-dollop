import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { ClientToServerEvents, ServerToClientEvents } from '../../types';
import chatEvents from './socket/chatEvents';

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

io.on('connection', chatEvents);

server.listen(process.env.VITE_PORT, () => {
	console.log(`Listening on port ${process.env.VITE_PORT}`);
});
