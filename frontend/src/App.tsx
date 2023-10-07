import './App.css';
import { ClientToServerEvents, ServerToClientEvents, User } from '../../types';
import { io, Socket } from 'socket.io-client';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
	`http://localhost:${import.meta.env.VITE_PORT}`
);

function App() {
	const user: User = {
		id: '1',
		email: 'randomemail@email.com',
		password: 'randompassword',
		username: 'theradbrad',
	};
	socket.emit('join_room', user, 'theradbrads room');
	return (
		<>
			<div>This is an interesting div</div>
		</>
	);
}

export default App;
