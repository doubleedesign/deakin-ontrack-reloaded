import styled, { css } from 'styled-components';
import { Row } from '../common.styled.ts';
import { breakpointUp } from '@doubleedesign/styled-media-queries';
import { ThemeToggleButton } from '../ThemeToggle/ThemeToggle.styled.ts';

export const HeaderWrapper = styled.header`
    padding-top: ${({ theme }): string => theme.spacing.md};
    padding-bottom: ${({ theme }): string => theme.spacing.md};

    ${props => breakpointUp(props.theme.breakpoints.lg, css`
        padding-top: ${({ theme }): string => theme.spacing.xl};
        padding-bottom: ${({ theme }): string => theme.spacing.xl}
    `)};
	
	${Row} {
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	
	h1 {
		display: flex;
		align-items: center;
		color: ${({ theme }): string => theme.colors.primary};
		
		img {
			height: 3rem;
			width: auto;
			display: inline-block;
			margin-right: ${({ theme }): string => theme.spacing.sm};
		}
		
		span {
            font-family: ${({ theme }): string => theme.fonts.accent};
			display: inline-block;
            color: ${({ theme }): string => theme.colors.accent};
            transform: rotate(-15deg);
            position: relative;
            bottom: -0.75rem;
            left: -2rem;
		}
	}
	
	form {
		margin-left: auto;
		width: auto;
		flex-basis: auto;
	}
	
	${ThemeToggleButton} {
        position: absolute;
		top: -4.75rem;
        right: 0;
		width: 3.5rem;
		height: 4.5rem;
		border-radius: 50px;
		padding-top: 1.5rem;
        display: flex;
        align-items: flex-end;
        padding-bottom: 0.4rem;
	}
`;
