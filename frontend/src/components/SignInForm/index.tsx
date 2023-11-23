import { FC, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

type Props = {
	register?: boolean;
};

const SignInForm: FC<Props> = ({ register }) => {
	const { setUsername, setPassword } = useAuth();

	const inputClasses: string = 'p-4 rounded-full bg-primary-dark min-w-full';

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	return (
		<div className='flex flex-col min-w-full px-16 space-y-5 sign-in-form xl:px-32'>
			<h2 className='pb-2 text-3xl'>{register ? 'Register' : 'Log in'}</h2>
			<form
				className='flex flex-col h-full space-y-4'
				onSubmit={(e) => handleSubmit(e)}
			>
				<label htmlFor='username' className='text-lg'>
					Enter your username
				</label>
				<input
					type='text'
					id='username'
					className={inputClasses}
					placeholder='Username'
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
				<label htmlFor='password' className='text-lg'>
					Password
				</label>
				<input
					type='password'
					id='password'
					className={inputClasses}
					placeholder='Password'
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<Link
					to='/home'
					type='submit'
					className='p-4 text-center text-black bg-white rounded-2xl'
				>
					{register ? 'Register' : 'Log in'}
				</Link>
				<Link
					to={register ? '/' : '/register'}
					className='text-white transition opacity-70 hover:opacity-100'
				>
					{register
						? 'Already have an account? Login here'
						: 'New here? Register an account'}
				</Link>
				<a
					href='#'
					className='text-white transition opacity-70 hover:opacity-100'
				>
					Forgot your password?
				</a>
			</form>
		</div>
	);
};

export default SignInForm;
