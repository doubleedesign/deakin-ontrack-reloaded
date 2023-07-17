import styled, { css } from 'styled-components';
import { Row } from '../common.styled.ts';
import { breakpointUp } from '@doubleedesign/styled-media-queries';
import { ThemeToggleButton } from '../ThemeToggle/ThemeToggle.styled.ts';
import { NavLink } from 'react-router-dom';
import { readableColor } from 'polished';

export const HeaderWrapper = styled.header`
    padding-top: ${({ theme }): string => theme.spacing.md};

    ${props => breakpointUp(props.theme.breakpoints.lg, css`
        margin-bottom: -2rem;
    `)};
	
	${Row} {
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	
	${ThemeToggleButton} {
        position: absolute;
		top: -3.75rem;
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

export const LogoNavLink = styled(NavLink)`
	text-decoration: none;
	display: block;

    h1 {
        display: flex;
        align-items: center;
        color: ${({ theme }): string => theme.colors.logo};

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

export const HeaderUserLinks = styled.div`
    position: absolute;
    top: -0.75rem;
    right: 5rem; // allow space for the theme toggle
`;

export const HeaderLinkButton = styled.button`
	color: ${props => readableColor(props.theme.colors.contentBackground)};
	font-size: 0.8rem;
	cursor: pointer;
	font-family: ${({ theme }): string => theme.fonts.body};
	border: 0;
	appearance: none;
	background: transparent;
	transition: all 0.3s ease;
	text-decoration: underline;
	text-decoration-color: transparent;
	padding: 0 ${({ theme }): string => theme.spacing.sm};
	border-right: 1px solid currentColor;
	
	&:last-child {
		border: 0;
	}
	
	svg {
		font-size: 1rem;
	}
	
	&:hover, &:focus-visible {
		color: ${({ theme }): string => theme.colors.accent};
		text-decoration-color: currentColor;
	}
`;
