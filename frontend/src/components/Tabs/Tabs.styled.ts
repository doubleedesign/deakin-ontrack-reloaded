import styled, { css } from 'styled-components';
import { Row, Col } from '../common.styled.ts';
import { breakpointUp } from '@doubleedesign/styled-media-queries';
import { readableColor, shade } from 'polished';
export const TabSection = styled(Row)`
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;

    ${props => breakpointUp(props.theme.breakpoints.lg, css`
        flex-wrap: nowrap;
    `)};
`;

export const TabNav = styled(Col).attrs({ as: 'nav' })`
    width: 100%;
    flex-basis: 100%;

    ${props => breakpointUp(props.theme.breakpoints.lg, css`
        width: 200px;
	    flex-basis: 200px;
	    min-width: 200px;
	    flex-grow: 0;
	    padding-right: 0;
    `)};
`;

export const TabNavList = styled.ul.attrs({ role: 'tablist' })`
`;

interface EachTabProps {
	tabKey?: string;
	open?: string;
	color?: string;
}

export const TabNavItem = styled.li`
	list-style: none;
`;

export const TabNavButton = styled.button.attrs((props: EachTabProps) => ({
	role: 'tab',
	id: `button-${props.tabKey}`,
	'aria-controls': `panel-${props.tabKey}`
}))<EachTabProps>`
	padding: ${({ theme }): string => theme.spacing.md} ${({ theme }): string => theme.spacing.sm};
	appearance: none;
	font-family: ${({ theme }): string => theme.fonts.body};
    font-weight: 600;
	border: 0;
	width: 100%;
	text-align: left;
	cursor: pointer; 
	transition: all 0.3s ease;
	text-decoration: underline;
	text-decoration-color: transparent;
	font-size: 0.9rem;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	background: ${({ theme }): string => shade(0.07, theme.colors.contentBackground)};
	color: ${({ theme }): string => readableColor(theme.colors.contentBackground)};
	position: relative;
	height: 52px;
	
	&:hover, &:focus-visible {
		text-decoration-color: currentColor;
	}
	
	svg {
		margin-right: ${({ theme }): string => theme.spacing.sm};
	}
	
	&[aria-selected="true"] {
        background: ${props => props.color ? props.theme.colors[props.color] : 'unset'};
        color: ${props => props.color ? readableColor(props.theme.colors[props.color]) : 'unset'};
		
		svg {
            color: ${props => props.color ? readableColor(props.theme.colors[props.color]) : 'currentColor'};
		}
		
		&:before,
		&:after {
            content: '';
            width: 0;
            height: 0;
            border-style: solid;
			position: absolute;
			right: -1rem;
		}
		
		&:before {
			position: absolute;
			top: 0;
            border-width: 26px 0 0 1rem;
            border-color: transparent transparent transparent ${props => props.color ? props.theme.colors[props.color] : 'unset'};
		}

        &:after {
            position: absolute;
            bottom: 0;
            border-width: 26px 1rem 0 0;
            border-color: ${props => props.color ? props.theme.colors[props.color] : 'unset'} transparent transparent transparent;
        }
	}
`;

export const TabPanels = styled(Col).attrs({ as: 'div' })`
	width: 100%;
	flex-basis: 100%;

    ${props => breakpointUp(props.theme.breakpoints.lg, css`
        width: auto;
	    flex-basis: auto;
	    flex-grow: 1;
    `)};
`;

// @ts-ignore
export const TabContent = styled.div.attrs((props: EachTabProps) => ({
	role: 'tabpanel',
	id: `panel-${props.tabKey}`,
	'aria-labelledby': `button-${props.tabKey}`,
	'aria-expanded': props.open,
	'tabIndex': props.open ? 0 : -1
}))<EachTabProps>`
	display: ${props => props.open ? 'block' : 'none'};

    ${props => breakpointUp(props.theme.breakpoints.lg, css`
        padding-left: 0;
    `)};
`;
