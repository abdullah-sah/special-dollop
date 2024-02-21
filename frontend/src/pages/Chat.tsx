import { FC, useEffect } from 'react';
import ChatItem from '../components/ChatItem';
import ChatDivider from '../components/ChatDivider';
import useAuth from '../hooks/useAuth';
import { Outlet } from 'react-router-dom';
import UserSearch from '../components/UserSearch';

const Chat: FC = () => {
	const { user } = useAuth();

	useEffect(() => {
		console.log('we have run my friend');
		console.log('the use is now, ', user);
	}, [user?.friendsList?.length]);

	return (
		<div className='flex flex-row'>
			<div className='flex flex-row w-48 text-white list-none bg-primary-dark chat-page'>
				<aside className='w-full'>
					<ul className='flex flex-col min-h-screen chat-list'>
						<UserSearch />

						<ChatDivider
							text='direct beams'
							children={user?.friendsList?.map((friend, i) => (
								<ChatItem
									name={friend.username ?? `Anonymous User ${i}`}
									chatId={friend.username ?? `Anonymous User ${i}`}
									key={i}
								/>
							))}
						/>

						<ChatDivider
							text='group beams'
							children={user?.joinedRooms?.map((roomMember, i) => (
								<ChatItem
									name={roomMember.room?.name ?? `Unnamed Room ${i}`}
									chatId={roomMember.room?.name ?? `Unnamed Room ${i}`}
									key={i}
								/>
							))}
						/>
					</ul>
				</aside>
			</div>
			<Outlet />
		</div>
	);
};

export default Chat;
