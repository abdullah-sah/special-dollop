import { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SendIcon from '../ui/icons/Send';
import useAuth from '../../hooks/useAuth';
import { sendMessageToUser } from '../../utils/message';
import type { MessageWithRelations } from '../../../../types';
import ImageLoader from '../ui/ImageLoader';

const ChatInterface: FC = () => {
	const { user } = useAuth();
	const { chatId } = useParams<{ chatId: string }>();
	const [newMessage, setNewMessage] =
		useState<MessageWithRelations['content']>('');

	const [messagesToDisplay, setMessagesToDisplay] = useState<
		MessageWithRelations[]
	>([...(user.sentMessages ?? [])]);

	const handleSendMessage = async () => {
		console.log(newMessage);

		if (newMessage.length > 0) {
			const response = await sendMessageToUser(user, chatId!, newMessage);
			if (response.success && response.data.content) {
				setMessagesToDisplay([...messagesToDisplay, response.data]);
			}
			console.log('the response for handleSendMessage was', response);
		} else {
			console.log('message aint long enough matey');
		}
	};

	useEffect(() => {
		console.log('faaack you mate');
	}, [messagesToDisplay?.length, chatId]);

	return (
		<div className='flex flex-col justify-between w-full h-screen p-4 bg-gray-900'>
			<div className='mb-4 overflow-auto'>
				{user.sentMessages?.map((message) => (
					<div key={message.id} className='flex items-end mb-4 space-x-2'>
						<ImageLoader src='' className='w-10 h-10 rounded-full' />
						<div className='flex flex-col'>
							<div className='text-sm text-gray-300'>
								<span className='font-semibold text-white'>user username</span>{' '}
								{message.timestamp}
							</div>
							<div className='max-w-xs p-3 text-white bg-gray-800 rounded-lg lg:max-w-md'>
								{message.content}
							</div>
						</div>
					</div>
				))}
			</div>
			<div className='flex items-center p-2 bg-gray-800 rounded-lg'>
				<input
					type='text'
					className='flex-1 text-white placeholder-gray-400 bg-transparent border-none outline-none'
					placeholder='Type a new message...'
					// value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
				/>
				<button onClick={handleSendMessage} className='p-2 text-white'>
					<SendIcon />
				</button>
			</div>
		</div>
	);
};

export default ChatInterface;
