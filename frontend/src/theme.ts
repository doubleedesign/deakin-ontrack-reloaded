import { adjustHue, darken, lighten, shade, tint, desaturate, complement, readableColor } from 'polished';

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
		xl: '2rem',
		xxl: '3rem'
	},
	breakpoints: {
		sm: 520,
		md: 720,
		lg: 990,
		xl: 1200,
		xxl: 1440
	}
};

const lightModePrimary = '#00a7d9';
const lightModeGreen = '#71d900';
const darkModePrimary = desaturate(0.2, tint(0.2, lightModePrimary));
const darkModeGreen = tint(0.3, desaturate(0.1, lightModeGreen));

function generateColors(baseColor: string, baseGreen: string) {
	return {
		primary: baseColor,
		secondary: shade(0.2, adjustHue(75, baseColor)),
		accent: tint(0.3, adjustHue(120, baseColor)),
		// Always start with a shade of green for the 'status color' calculations,
		// so the results are more likely to make sense
		success: tint(0.1, baseGreen),
		error: adjustHue(255, baseGreen),
		warning: lighten(0.05, adjustHue(315, baseGreen)),
		info: adjustHue(120, baseGreen),
	};
}

export const lightTheme = {
	...baseTheme,
	colors: {
		...generateColors(lightModePrimary, lightModeGreen),
		logo: '#2424c4',
		pageBackground: '#f6f5f5',
		contentBackground: '#FFF',
		reverse: '#100e17',
		reverseSubtle: '#827d8f',
		bodyText: '#100e17',
		themeToggle: '#d9d9d9',
		themeToggleHover: 'rgba(0,0,0,0.8)',
		themeToggleColor: 'rgba(255,255,255,0.5)'
	}
};


export const darkTheme = {
	...baseTheme,
	colors: {
		...generateColors(darkModePrimary, darkModeGreen),
		logo: '#5b5bf6',
		pageBackground: '#100e17',
		contentBackground: '#1c1928',
		reverse: '#e7e7e7',
		reverseSubtle: '#414146',
		bodyText: '#e7e7e7',
		themeToggle: 'rgba(255,255,255,0.2)',
		themeToggleHover: 'rgba(255,255,255,0.2)',
		themeToggleColor: '#fac84c'
	}
};
