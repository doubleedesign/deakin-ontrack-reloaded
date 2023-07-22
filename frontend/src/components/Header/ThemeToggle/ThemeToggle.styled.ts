import styled from 'styled-components';

export const ThemeToggleButton = styled.button`
	appearance: none;
	background: ${({ theme }): string => theme.colors.themeToggle};
	border: 0;
	width: 2.5rem;
	height: 2.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.25rem;
	border-radius: 2rem;
	cursor: pointer;
	transition: all 0.3s ease;
	
	&:hover, &:focus-visible {
		color: ${({ theme }): string => theme.colors.themeToggleColor};
		background: ${({ theme }): string => theme.colors.themeToggleHover};
	}
`;
