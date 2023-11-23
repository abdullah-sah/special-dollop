import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('userAuth must be used within an AuthProvider');
	}
	return context;
};

export default useAuth;
