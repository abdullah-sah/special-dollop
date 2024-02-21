import { FC, useState } from 'react';
import { addFriend, searchForUser } from '../../utils/user';
import useAuth from '../../hooks/useAuth';
import type { UserWithRelations } from '../../../../types';

const UserSearch: FC = () => {
	const { username, setUser, user } = useAuth();
	const [searchResults, setSearchResults] = useState<UserWithRelations[]>([]);

	const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value.length > 2) {
			const results = await searchForUser(e.target.value);
			if (results.success) {
				// only storing the first 7 results
				setSearchResults(results.data.slice(0, 7));
			}
		} else setSearchResults([]);
	};

	const handleUserClick = async (
		event: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		if (
			user?.friendsList?.some(
				(friend) =>
					friend?.username?.toLowerCase() ===
					event.currentTarget.innerText.toLowerCase()
			)
		) {
			console.log('that user is already a friend');
			return;
		}
		const response = await addFriend(username, event.currentTarget.innerText);
		if (!response.success) {
			console.log('there was an error with adding a friend to that user');
			return;
		}
		console.log('the response in handleUserClick is', response);
		setUser(response.data);
	};

	return (
		<>
			<div className='flex flex-row p-1 text-black user-search'>
				<input
					type='text'
					placeholder='Search for users'
					className='w-full text-black rounded-md'
					onChange={(e) => handleSearchChange(e)}
				/>
			</div>

			{searchResults.length > 0 && (
				<div className='search-results'>
					{searchResults.map((user, i) => (
						<div
							key={i}
							className='py-1 cursor-pointer search-result-item hover:bg-secondary-dark'
							onClick={(e) => handleUserClick(e)}
						>
							{user.username}
						</div>
					))}
				</div>
			)}
		</>
	);
};

export default UserSearch;
