import { genSalt, hash } from 'bcrypt';

export const generateHash = async (password: string) => {
	return genSalt().then((salt) =>
		hash(password, salt).then((passwordHash) => passwordHash)
	);
};
