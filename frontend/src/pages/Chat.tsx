import { FC } from 'react';
import ChatItem from '../components/ChatItem';

const Chat: FC = () => {
	const names = ['barry', 'steve', 'gary', 'bob', 'larry'];

	return (
		<div className='w-48 text-white list-none bg-primary-dark chat-page'>
			<section className='flex flex-col min-h-screen chat-list'>
				{names.map((name) => (
					<ChatItem name={name}  />
				))}
			</section>
		</div>
	);
};

export default Chat;
