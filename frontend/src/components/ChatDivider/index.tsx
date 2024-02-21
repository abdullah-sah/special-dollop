import { FC, ReactElement, useState } from 'react';

type Props = {
	text: string;
	children?: ReactElement[];
};

const ChatDivider: FC<Props> = ({ text, children }) => {
	const [showChildren, setShowChildren] = useState<boolean>(true);

	const handleClick = () => {
		setShowChildren(!showChildren);
	};

	return (
		<>
			<li
				className='flex flex-col p-2 capitalize border-t-2 border-slate-400'
				onClick={handleClick}
			>
				<div className='flex items-center gap-3 cursor-pointer'>
					• {text}
					<svg
						className={`transition-transform transform ${
							showChildren ? 'rotate-0' : 'rotate-180'
						}`}
						width='16'
						height='16'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					>
						<path d='M6 9l6 6 6-6' />
					</svg>
				</div>
				{showChildren && <ul>{children}</ul>}
			</li>
		</>
	);
};

export default ChatDivider;
