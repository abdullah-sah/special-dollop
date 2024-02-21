import ReactDOM from 'react-dom/client';
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import Home from './pages/Home.tsx';
import SignIn from './pages/SignIn.tsx';
import Chat from './pages/Chat.tsx';
import ChatInterface from './components/ChatInterface/index.tsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: '',
				element: <SignIn />,
			},
			{
				path: 'register',
				element: <SignIn register />,
			},
			{
				path: 'home',
				element: <Home />,
			},
			{
				path: 'chat',
				element: <Chat />,
				children: [
					{
						path: ':chatId',
						element: <ChatInterface />,
					},
				],
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
