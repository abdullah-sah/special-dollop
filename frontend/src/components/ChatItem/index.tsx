import { FC } from 'react';

type Props = {
	name: string;
};

const ChatItem: FC<Props> = ({ name }) => {
	return (
		<>
			<li className='text-slate-700 bg-primary-dark hover:bg-secondary-dark'>{name}</li>
		</>
	);
};

export default ChatItem;
