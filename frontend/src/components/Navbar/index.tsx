import { FC } from 'react';
import NavItem from './NavItem';

const Navbar: FC = () => {
	// const navItems = ['Home', 'Rooms', 'Friends', 'Profile'];

	return (
		<>
			<nav className='flex items-center min-h-screen text-white rounded-r-lg max-w-22 bg-primary-dark'>
				<ul className='flex flex-col space-y-2'>
					<NavItem link='/home' type='home' />
					<NavItem link='/' type='search' />
					<NavItem link='/chat' type='chat' />
					<NavItem link='/' type='group' />
				</ul>
			</nav>
		</>
	);
};

export default Navbar;
