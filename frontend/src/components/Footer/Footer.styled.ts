import styled from 'styled-components';
import { transparentize } from 'polished';

export const FooterWrapper = styled.footer`
	padding: ${({ theme }): string => theme.spacing.md};
	text-align: center;
	font-size: 0.8rem;
	
	p {
		color: ${props => transparentize(0.4, props.theme.colors.bodyText)};
	}
	
	a {
		color: currentColor;
		transition: color 0.3s ease;
		
		&:hover, &:focus, &:active {
			color: ${({ theme }): string => theme.colors.accent};
		}
	}
`;
