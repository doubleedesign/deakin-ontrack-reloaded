import styled, { css } from 'styled-components';
import { breakpointUp } from '@doubleedesign/styled-media-queries';

export const DrawerWrapper = styled.aside<{open: boolean}>`
    background: ${({ theme }): string => theme.colors.contentBackground};
    padding: ${({ theme }): string => theme.spacing.md};
	height: 100vh;
    position: absolute;
    top: 0;
    right: 0;
	bottom: 0;
	width: ${props => props.open ? '25rem' : '0'};
	max-width: 25rem;
    transform: ${props => props.open ? 'translateX(0)' : 'translateX(25rem)' };
    transition: all 0.3s ease;
	z-index: 1000;
`;

export const DrawerContent = styled.div`
	padding: ${({ theme }): string => theme.spacing.md};
	background: ${({ theme }): string => theme.colors.contentBackground};
	position: relative;
	z-index: 600;
	height: 100%;
	width: 100%;
	
    ${props => breakpointUp(props.theme.breakpoints.lg, css`
       	padding: ${props => props.theme.spacing.lg};
    `)};
	
	[data-component-id="CloseButton"] {
		position: absolute;
		top: 0;
		right: 0;
    }

    h2 {
        margin-bottom: ${({ theme }): string => theme.spacing.lg};
    }
`;
