import { FC, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { signIn, signUp } from '../../utils/user';

type Props = {
	register?: boolean;
};

const SignInForm: FC<Props> = ({ register }) => {
	const {
		username,
		email,
		password,
		setUser,
		setUsername,
		setEmail,
		setPassword,
		setToken,
	} = useAuth();
	const navigate = useNavigate();

	const inputClasses: string = 'p-4 rounded-full bg-primary-dark min-w-full';

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const response = register
			? await signUp(username, password, email)
			: await signIn(username, password);
		if (response.success) {
			setUser(response.data.user);
			setToken(response.data.token);
			navigate('/home');
		} else {
			console.error(
				'there was an error with sign/register. the response was: ',
				response
			);
		}
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

				{register && (
					<>
						<label htmlFor='email' className='text-lg'>
							Enter your email
						</label>
						<input
							type='text'
							id='email'
							className={inputClasses}
							placeholder='Email'
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</>
				)}
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
				<button
					type='submit'
					className='p-4 text-center text-black bg-white rounded-2xl'
				>
					{register ? 'Register' : 'Log in'}
				</button>
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
