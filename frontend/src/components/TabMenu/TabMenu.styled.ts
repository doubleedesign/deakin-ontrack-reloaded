import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Row, Col } from '../common.styled.ts';
import { meetsContrastGuidelines, readableColor, shade } from 'polished';

export const TabMenuWrapper = styled(Row).attrs({ as: 'nav' })`
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
	
	&.tab-home {
		margin-right: auto;
		margin-left: 0;
	}
`;

// @ts-ignore
export const TabMenuNavLink = styled(NavLink)<{color: string}>`
	display: block;
	border-top-left-radius: 0.25rem;
	border-top-right-radius: 0.25rem;
    padding: ${({ theme }): string => theme.spacing.sm} ${({ theme }): string => theme.spacing.lg};
    background: ${props => props.color};
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
	font-weight: 600;
	text-decoration-color: transparent;
	transition: all 0.3s ease;
	
	&[aria-current="page"] {
	}
	
	&:hover, &:focus-visible {
		background: ${props => shade(0.2, props.color)};
	}
	
	&:focus-visible {
		text-decoration-color: currentColor;
	}
`;
