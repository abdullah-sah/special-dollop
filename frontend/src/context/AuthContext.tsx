import { createContext, useState, FC, ReactNode } from 'react';
import type {
	User,
	Message,
	Room,
} from '../../../backend/node_modules/generated/prisma';

interface AuthContextType {
	user: User & { messages: Message[]; joinedRooms: Room[] };
	username: User['username'];
	email: User['email'];
	password: User['password'];
	token: string;
	setUser: (user: User & { messages: Message[]; joinedRooms: Room[] }) => void;
	setUsername: (username: User['username']) => void;
	setEmail: (email: User['email']) => void;
	setPassword: (password: User['password']) => void;
	setToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<
		User & { messages: Message[]; joinedRooms: Room[] }
	>({} as User & { messages: Message[]; joinedRooms: Room[] });
	const [username, setUsername] = useState<User['username']>('');
	const [email, setEmail] = useState<User['email']>('');
	const [password, setPassword] = useState<User['username']>('');
	const [token, setToken] = useState<string>('');

	return (
		<AuthContext.Provider
			value={{
				user,
				username,
				email,
				password,
				token,
				setUser,
				setUsername,
				setEmail,
				setPassword,
				setToken,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
