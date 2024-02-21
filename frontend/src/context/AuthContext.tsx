import { createContext, useState, FC, ReactNode } from 'react';
import type { User } from '../../../backend/node_modules/generated/prisma';
import type { UserWithRelations } from '../../../types';

interface AuthContextType {
	user: UserWithRelations;
	username: User['username'];
	email: User['email'];
	password: User['password'];
	token: string;
	setUser: (user: UserWithRelations) => void;
	setUsername: (username: User['username']) => void;
	setEmail: (email: User['email']) => void;
	setPassword: (password: User['password']) => void;
	setToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<UserWithRelations>({} as UserWithRelations);
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
