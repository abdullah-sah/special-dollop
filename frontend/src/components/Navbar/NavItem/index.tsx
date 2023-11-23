import { FC, useState, useEffect, ReactElement, createElement } from 'react';
import type { NavItemProps } from '../types';
import type { Icon } from '../../ui/icons/types';

const NavItem: FC<NavItemProps> = ({ type, link }) => {
	const [IconComponent, setIconComponent] = useState<ReactElement | null>(null);
	const typeIconMapping: Record<Icon, string> = {
		home: 'Home',
		chat: 'Chat',
		search: 'Search',
		group: 'Group',
	};

	useEffect(() => {
		setIconComponent(null);

		import(`../../ui/icons/${typeIconMapping[type]}.tsx`)
			.then((module) => setIconComponent(() => createElement(module.default)))
			.catch((err) => console.error(`Error loading icon type ${type}`, err));
	}, [type]);

	return (
		<>
			<li className='w-full h-full p-4 text-xl text-white list-none'>
				<a
					className='flex flex-col items-center justify-center text-base font-bold transition-opacity opacity-60 hover:opacity-100'
					href={link}
				>
					{IconComponent ?? ''}
					{type}
				</a>
			</li>
		</>
	);
};

export default NavItem;
