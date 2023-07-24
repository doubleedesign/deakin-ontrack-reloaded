import styled from 'styled-components';

export const FooterWrapper = styled.footer`
	padding: ${({ theme }): string => theme.spacing.md};
	text-align: center;
	font-size: 0.8rem;
	opacity: 0.7;
	
	&:hover, &:focus-within {
		opacity: 1;
	}
	
	a {
		color: currentColor;
		transition: color 0.3s ease;
		
		&:hover, &:focus, &:active {
			color: ${({ theme }): string => theme.colors.info};
		}
	}
`;
