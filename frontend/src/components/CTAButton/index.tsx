import { FC } from 'react';

type Props = {
	text: string;
};

const CTAButton: FC<Props> = ({ text }) => {
	return (
		<button className='px-8 py-3 text-white capitalize transition-opacity rounded-full bg-secondary-dark hover:opacity-80 min-w-[12rem]'>
			{text}
		</button>
	);
};

export default CTAButton;
