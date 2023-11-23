import { FC } from 'react';
import logo from '../assets/logo.png';
import SignInForm from '../components/SignInForm';

type Props = {
	register?: boolean;
};

const SignIn: FC<Props> = ({ register }) => {
	const shapeClasses: string =
		'flex flex-col items-center justify-center w-full h-full';

	return (
		<div className='flex flex-row h-screen text-white' aria-hidden>
			<div className={`${shapeClasses} bg-primary-darker`}>
				<div className='flex flex-col items-center justify-center min-w-full px-32'>
					<img src={logo} />
					<h1 className='p-4 text-5xl'>BitBeam</h1>
					<p>Chat, transcended</p>
				</div>
			</div>
			<div className={`${shapeClasses} bg-secondary-dark`}>
				<SignInForm register={register} />
			</div>
		</div>
	);
};

export default SignIn;
