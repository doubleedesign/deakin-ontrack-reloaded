import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Row, Col } from '../common.styled.ts';
import { meetsContrastGuidelines, readableColor, shade, darken, lighten } from 'polished';

export const TabMenuWrapper = styled(Row).attrs({ as: 'nav' })`
	position: relative;
	bottom: -1px;
`;

export const TabMenuList = styled(Col).attrs({ as: 'ul' })`
	list-style: none;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	margin: 0 ${({ theme }): string => theme.spacing.lg};
`;

export const TabMenuListItem = styled.li`
	margin-left: ${({ theme }): string => theme.spacing.sm};
	position: relative;
    overflow-y: clip;
	padding-top: 0.5rem;
	
	&.tab-home {
        order: 100;
		
		span {
			padding-left: 0;
			padding-right: 0;
			width: 3rem;
		}
    }
`;

// @ts-ignore
export const TabMenuNavLink = styled(NavLink)<{color: string}>`
	display: block;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
	height: 2rem; // explicit height to patch the triangles on :before and :after
	line-height: 1;
    position: relative;
	text-decoration: none;
	
	span {
		display:  block;
		text-align: center;
		position: relative;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        background: ${props => props.color};
        font-weight: 600;
		text-decoration: underline;
        text-decoration-color: transparent;
        transition: all 0.3s ease;
        padding: ${({ theme }): string => theme.spacing.sm} ${({ theme }): string => theme.spacing.lg};
        color: ${props => {
		// Cheating to allow more white. Hey, it's my app.
		const scores = meetsContrastGuidelines(shade(0.4, props.color), '#FFF');
		if(scores.AA) {
			return '#FFF';
		}
		else {
			return readableColor(props.color);
		}
	}};
		
		svg {
			position: relative;
			z-index: 100;
		}
	}
	
	&:before,
	&:after {
		content: '';
		position: absolute;
		top: 0;
        transition: all 0.3s ease;
		width: 1.5rem;
		height: 2.75rem;
		background: ${props => props.color};
	}
	
	&:before {
        left: 0;
		transform-origin: top right;
        transform: rotate(45deg) translateX(0.65rem) translateY(1rem);
	}
	
	&:after {
		right: 0;
		transform-origin: top left;
		transform: rotate(-45deg) translateX(-0.65rem) translateY(1rem);
	}
	
	&[aria-current="page"] {
		z-index: 20;
        box-shadow: 0 -1px 0.25rem 0 ${({ theme }): string => darken(0.125, theme.colors.reverseSubtle)};
		
		&:before,
		&:after {
            box-shadow: 0 0 0.25rem 1px ${({ theme }): string => darken(0.125, theme.colors.reverseSubtle)};
		}
		
		span {
            z-index: 25;
		}
	}
	
	&:hover, &:focus-visible {
		background: ${props => shade(0.2, props.color)};

        span {
            text-decoration-color: currentColor;
        }
		
		span,
		&:before,
		&:after {
            background: ${props => shade(0.2, props.color)};
		}
	}
`;
