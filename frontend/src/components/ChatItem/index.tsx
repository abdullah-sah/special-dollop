import { FC } from 'react';
import { NavLink } from 'react-router-dom';

type Props = {
	name: string;
	chatId: string;
};

const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
	e.stopPropagation();
};

const ChatItem: FC<Props> = ({ name, chatId }) => {
	const baseClasses =
		'flex transition-colors rounded-full p-2 px-4 text-slate-500 bg-primary-dark hover:bg-secondary-dark hover:text-white';

	return (
		<li>
			<NavLink
				to={chatId}
				onClick={handleClick}
				className={({ isActive }) =>
					isActive
						? `${baseClasses} bg-primary-darker rounded-none`
						: baseClasses
				}
			>
				{name}
			</NavLink>
		</li>
	);
};

export default ChatItem;
