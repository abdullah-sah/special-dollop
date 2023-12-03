import { FC } from 'react';
import ImageLoader from '../ui/ImageLoader';
import { Link } from 'react-router-dom';
import AddItemIcon from '../ui/icons/AddItem';

type Props = {
	username: string;
	lastSeen?: string;
	link?: string;
	profilePicture?: string;
	chatPicture?: string;
	template?: boolean;
};

const defaultChatPicture: string =
	'https://www.gamewallpapers.com/img_script/wallpaper_dir/img.php?src=wallpaper_halo_infinite_32_2560x1440.jpg&height=450&width=800&fill-to-fit&sharpen';

const defaultProfilePicture: string =
	'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3xM2vjVkOGoeb34L7o1BU93Nmi0zAz6BvDw&usqp=CAU';

const MessageCard: FC<Props> = ({
	username,
	link,
	profilePicture,
	chatPicture,
	lastSeen,
	template,
}) => {
	const handleCreateMessage = () => {};

	if (!template)
		return (
			<Link
				to={link || '/'}
				className='flex flex-col border rounded-[2rem] card border-neutral-400 border-opacity-40 shadow-md shadow-slate-800 w-80'
			>
				<div className='flex flex-row items-center gap-3 p-4 image-container'>
					{profilePicture && (
						<ImageLoader
							src={profilePicture}
							alt='profile picture'
							width='50px'
							className='rounded-full'
							fallbackSrc={defaultProfilePicture}
						/>
					)}
					<div className='flex flex-col justify-center text-container'>
						<p className='text-lg font-bold'>{username}</p>
						<p className='text-xs'>last seen: {lastSeen}</p>
					</div>
				</div>

				{chatPicture && (
					<ImageLoader
						src={chatPicture}
						width='100%'
						fallbackSrc={defaultChatPicture}
						className='rounded-b-[2rem]'
						imgProps={{ 'aria-hidden': true }}
					/>
				)}
			</Link>
		);
	else {
		return (
			<div
				className='cursor-pointer flex flex-col border rounded-[2rem] card border-neutral-400 border-opacity-40 shadow-md shadow-slate-800 w-80'
				onClick={handleCreateMessage}
			>
				<div className='flex flex-row items-center gap-3 p-4 image-container'>
					<AddItemIcon className='w-16' />
					<div className='flex flex-col justify-center text-container'>
						<p className='text-lg font-bold capitalize'>{username}</p>
					</div>
				</div>
			</div>
		);
	}
};

export default MessageCard;
