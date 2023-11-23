/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				blender: ['blender pro', 'sans-serif'],
			},
			colors: {
				'primary-darker': '#161616',
				'primary-dark': '#282828',
				'secondary-dark': '#8127CE',
			},
		},
	},
	plugins: [],
};
