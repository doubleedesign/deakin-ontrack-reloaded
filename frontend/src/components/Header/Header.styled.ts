import styled, { css } from 'styled-components';
import { Row } from '../common.styled.ts';
import { breakpointUp } from '@doubleedesign/styled-media-queries';
import { ThemeToggleButton } from './ThemeToggle/ThemeToggle.styled.ts';
import { NavLink } from 'react-router-dom';

export const HeaderWrapper = styled.header`

    ${props => breakpointUp(props.theme.breakpoints.lg, css`
        margin-bottom: -2.25rem;
    `)};
	
	${Row} {
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
	}
`;

export const LogoNavLink = styled(NavLink)`
	text-decoration: none;
	display: block;

    h1 {
        display: flex;
        align-items: center;
        color: ${({ theme }): string => theme.colors.logo};

        ${props => breakpointUp(props.theme.breakpoints.lg, css`
	        position: relative;
	        bottom: -1rem;
	    `)};

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
            bottom: -0.5rem;
            left: -2rem;
        }
    }
`;

export const HeaderUserLinks = styled.nav`
	padding-bottom: ${({ theme }): string => theme.spacing.md};
    position: relative;
    top: -0.75rem;
	
	ul {
        display: flex;
        justify-content: flex-end;
        align-items: center;
	}
`;

export const HeaderUserLinkItem = styled.li<{hasDivider?: boolean}>`
    border-right: ${props => props.hasDivider ? '1px solid currentColor' : ''};
    list-style: none;
    line-height: 1;

    ${ThemeToggleButton} {
        width: 3.5rem;
        height: 4.5rem;
        border-radius: 50px;
        padding-top: 1.5rem;
        display: flex;
        align-items: flex-end;
        padding-bottom: 0.4rem;
	    position: relative;
	    top: -1.25rem;
	    margin-left: ${({ theme }): string => theme.spacing.md};
    }
}
`;
