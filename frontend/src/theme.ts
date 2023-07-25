import { adjustHue, darken, lighten, shade, tint, desaturate, complement, readableColor, saturate } from 'polished';

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

const lightmodeBaseColor = '#2424c4';
const darkmodeBaseColor = '#5b5bf6';

export const lightTheme = {
	...baseTheme,
	colors: {
		logo: lightmodeBaseColor,
		success: adjustHue(255, lightmodeBaseColor),
		error: saturate(0.2, adjustHue(105, lightmodeBaseColor)),
		info: saturate(0.2, adjustHue(330, lightmodeBaseColor)),
		warning: saturate(0.2, lighten(0.05, adjustHue(165, lightmodeBaseColor))),
		accent: '#a007a6', // for tabs
		pageBackground: '#f6f5f5',
		contentBackground: '#FFF',
		reverse: '#100e17',
		reverseSubtle: '#827d8f',
		bodyText: '#100e17',
		light: shade(0.07, '#FFF'),
		themeToggle: '#d9d9d9',
		themeToggleHover: 'rgba(0,0,0,0.8)',
		themeToggleColor: 'rgba(255,255,255,0.5)'
	}
};


export const darkTheme = {
	...baseTheme,
	colors: {
		logo: darkmodeBaseColor,
		success: lighten(0.2, tint(0.2, lightTheme.colors.success)),
		warning: lighten(0.2, tint(0.2, lightTheme.colors.warning)),
		info: lighten(0.1, tint(0.1, lightTheme.colors.info)),
		error: lighten(0.2, tint(0.2, lightTheme.colors.error)),
		accent: tint(0.2,'#a007a6'), // for tabs
		pageBackground: '#100e17',
		contentBackground: '#1c1928',
		reverse: '#e7e7e7',
		reverseSubtle: '#414146',
		bodyText: '#e7e7e7',
		light: 'rgba(255,255,255,0.1)',
		themeToggle: 'rgba(255,255,255,0.2)',
		themeToggleHover: 'rgba(255,255,255,0.2)',
		themeToggleColor: '#fac84c'
	}
};
