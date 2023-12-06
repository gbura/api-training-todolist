/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './dist/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Montserrat', 'sans-serif'],
			},
			colors: {
				deepDark: 'rgb(26, 26, 26)',
				lightDark: 'rgb(79, 82, 92)',
				lightBlue: 'rgb(0, 132, 255)',
				darkBlue: 'rgb(2, 84, 161)',
				light: 'rgb(245, 245, 245)',
				edit: 'rgb(15, 179, 69)',
			},
			boxShadow: {
				todoShadow: '4px 4px 5px rgba(82, 82, 82, 0.4)',
			},
		},
	},
	plugins: [],
}
