// import { useState, useEffect } from 'react';
// import './App.css';
// import {
// 	ClientToServerEvents,
// 	// RoomInput,
// 	ServerToClientEvents,
// } from '../../types';
// import { io, Socket } from 'socket.io-client';
// import { getUser } from '../../backend/src/socket/userEvents';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// import { v4 as uuidv4 } from 'uuid';

function App() {
	// const [userId, setUserId] = useState<string>('1');
	// const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
	// 	`http://localhost:${import.meta.env.VITE_PORT}`,
	// 	{ auth: { token: userId } }
	// );

	// // const room: RoomInput = {
	// // 	id: uuidv4(),
	// // 	description: 'This is my brand new description',
	// // 	createdAt: new Date(),
	// // 	isPrivate: false,
	// // 	name: 'this is my brand new rooms name',
	// // };

	// if (userId) {
	// 	socket.emit('auth', userId);
	// 	socket.emit('private_message', '2', 'this is an interesting sentence');
	// }

	// useEffect(() => {
	// 	socket.on('receive_message', async (data) => {
	// 		console.log('this is the data', data);
	// 		const sender = await getUser(data.senderId, true);
	// 		console.log('the sender is', sender);
	// 	});
	// }, [socket]);

	return (
		<>
			<AuthProvider>
				<header>
					<Navbar />
				</header>
				<main className='w-full font-mono text-white'>
					<Outlet />
				</main>
			</AuthProvider>
		</>
	);
}

export default App;
