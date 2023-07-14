const baseTheme = {
	fonts: {
		body: 'Yaldevi, sans-serif',
		accent: 'Nanum Pen Script, Yaldevi, sans-serif'
	},
	spacing: {
		xs: '0.25rem',
		sm: '0.5rem',
		md: '1rem',
		lg: '1.5rem',
		xl: '2rem'
	},
	breakpoints: {
		sm: 520,
		md: 720,
		lg: 990,
		xl: 1200,
		xxl: 1440
	}
};

export const lightTheme = {
	...baseTheme,
	colors: {
		primary: '#3939FF',
		secondary: '#00aac7',
		accent: '#eb00c4',
		pageBackground: '#FFF',
		reverse: '#100e17',
		reverseSubtle: '#5c566b',
		bodyText: '#100e17',
		themeToggle: '#d9d9d9',
		themeToggleHover: 'rgba(0,0,0,0.8)',
		themeToggleColor: 'rgba(255,255,255,0.5)',
	}
};

export const darkTheme = {
	...baseTheme,
	colors: {
		primary: '#5b5bf6',
		secondary: '#00aac7',
		accent: '#be2ea8',
		pageBackground: '#100e17',
		reverse: '#e7e7e7',
		reverseSubtle: '#676666',
		bodyText: '#e7e7e7',
		themeToggle: 'rgba(255,255,255,0.2)',
		themeToggleHover: 'rgba(255,255,255,0.2)',
		themeToggleColor: '#fac84c'
	}
};
