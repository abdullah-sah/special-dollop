import { Socket } from 'socket.io';
import {
	ClientToServerEvents,
	Room,
	User,
	ServerToClientEvents,
} from '../../../types';

const CHAT_BOT = 'BigManTing';

const rooms: Record<Room['id'], User['id'][]> = {};
const connectedSockets: Record<User['id'], User> = {};

const chatEvents = (
	socket: Socket<ClientToServerEvents, ServerToClientEvents>
) => {
	
};

export default chatEvents;
