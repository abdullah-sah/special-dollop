import { createContext, useState, FC, ReactNode } from 'react';
import type { User } from '../../../backend/node_modules/generated/prisma';

interface AuthContextType {
	username: User['username'];
	password: User['password'];
	setUsername: (username: User['username']) => void;
	setPassword: (password: User['password']) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [username, setUsername] = useState<User['username']>('');
	const [password, setPassword] = useState<User['username']>('');

	return (
		<AuthContext.Provider
			value={{ username, password, setUsername, setPassword }}
		>
			{children}
		</AuthContext.Provider>
	);
};
