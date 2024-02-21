import { FC, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import UserIcon from '../components/ui/icons/User';
import useAuth from '../hooks/useAuth';
import CTAButton from '../components/CTAButton';
import MessageCard from '../components/MessageCard';

const Home: FC = () => {
	const { username, user } = useAuth();

	useEffect(() => {
		console.log('yo');
	}, [user.receivedMessages, user.joinedRooms?.length]);

	return (
		<div className='flex flex-col gap-2 px-12 text-white'>
			<section className='flex flex-row p-4 text-white title'>
				<UserIcon className='w-24 h-24' />
				<div className='flex flex-col justify-center p-4 title-message'>
					<h1 className='text-2xl'>Welcome, {username}</h1>
					<p>
						this is an interesting sentence as a placeholder for perhaps a
						status message?
					</p>
				</div>
			</section>

			<div className='flex flex-row-reverse gap-6 chat-action-section'>
				<CTAButton text='Create Room' />
				<CTAButton text='Compose Message' />
			</div>

			<section className='flex flex-col gap-4 message-section'>
				<h2 className='text-2xl font-bold'>Messages</h2>
				<div className='flex flex-row flex-wrap gap-4 message-card-container'>
					{user.receivedMessages && user.receivedMessages?.length > 0 ? (
						user.receivedMessages?.map((message, i) => (
							<MessageCard
								profilePicture='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3xM2vjVkOGoeb34L7o1BU93Nmi0zAz6BvDw&usqp=CAU'
								username={message.recipient.username ?? 'Anonymouse Recipient'}
								chatPicture='https://www.gamewallpapers.com/img_script/wallpaper_dir/img.php?src=wallpaper_halo_infinite_32_2560x1440.jpg&height=450&width=800&fill-to-fit&sharpen'
								lastSeen='23/09/23'
								key={i}
							/>
						))
					) : (
						<MessageCard username='Compose new message' template />
					)}
				</div>
			</section>

			<section className='flex flex-col gap-4 room-section'>
				<h2 className='text-2xl font-bold'>Rooms</h2>
				<div className='flex flex-row flex-wrap gap-4 room-card-container'>
					{user.joinedRooms && user.joinedRooms?.length > 0 ? (
						user.joinedRooms?.map((roomMember, i) => (
							<MessageCard
								profilePicture='sdlfk'
								username={roomMember.user?.username ?? 'Anonymous User'}
								chatPicture='https://www.gamewallpapers.com/img_script/wallpaper_dir/img.php?src=wallpaper_halo_infinite_32_2560x1440.jpg&height=450&width=800&fill-to-fit&sharpen'
								lastSeen='23/09/23'
								key={i}
							/>
						))
					) : (
						<MessageCard template username='Create room' />
					)}
				</div>
			</section>
		</div>
	);
};

export default Home;
