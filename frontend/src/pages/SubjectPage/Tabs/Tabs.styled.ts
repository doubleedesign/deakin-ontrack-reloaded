import styled, { css } from 'styled-components';
import { Row, Col } from '../../../components/common.styled.ts';
import { breakpointUp } from '@doubleedesign/styled-media-queries';
import { meetsContrastGuidelines, readableColor, shade, transparentize } from 'polished';
import { StyledButton } from '../../../components/Button/Button.styled.ts';
import { ButtonGroupWrapper } from '../../../components/ButtonGroup/ButtonGroup.styled.ts';
import { isHexColor } from '../../../utils.ts';

export const TabSection = styled(Row)`
	display: flex;
	flex-wrap: wrap;
	margin-bottom: ${props => props.theme.spacing.lg};

    ${props => breakpointUp(props.theme.breakpoints.lg, css`
        flex-wrap: nowrap;
    `)};
`;

export const TabNavWrapper = styled(Col).attrs({ as: 'nav', 'data-component-id': 'TabNav' })`
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

export const TabNavList = styled(ButtonGroupWrapper).attrs({ role: 'tablist', as: 'ul' })`
	
	li {
		padding-left: 2px;
		padding-right: 2px;

        button {
            margin-left: 0;
            margin-right: 0;
	        padding-left: ${props => props.theme.spacing.sm};
	        padding-right: ${props => props.theme.spacing.sm};
        }
	}
`;

interface EachTabProps {
	tabKey?: string;
	open?: string;
	color?: string;
}

export const TabNavItem = styled.li`
	list-style: none;
`;

function customTextColor(bgColor: string, theme: { colors: { [x: string]: string; }; }) {
	let theColor: string;
	if(isHexColor(bgColor)) {
		theColor = bgColor;
	}
	else {
		theColor = theme.colors[bgColor];
	}
	const scores = meetsContrastGuidelines(shade(0.2, (theColor)), '#FFF');
	if(scores.AALarge) {
		return '#FFF';
	}
	return readableColor(shade(0.1, (theColor)));
}

export const TabNavButton = styled(StyledButton).attrs((props: EachTabProps) => ({
	role: 'tab',
	id: `button-${props.tabKey}`,
	'aria-controls': `panel-${props.tabKey}`
}))<EachTabProps>`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-start;
	flex-wrap: wrap;
	text-align: left;
	
	&:hover, &:focus-visible {
		text-decoration-color: currentColor;
	}
	
	strong, small {
        display: block;
        width: 100%;
        flex-basis: 100%;
	}
	
	small {
		font-weight: 300;
		font-size: 0.875em;
	} 
	
	svg {
		margin-right: ${({ theme }): string => theme.spacing.sm};
	}
	
	&[aria-selected="true"] {
        background: ${props => props.color ? props.theme.colors[props.color] : 'unset'};
        color: ${props => customTextColor(props.color, props.theme)};
		
		svg {
            color: ${props => customTextColor(props.color, props.theme)};
		}
	}
`;

export const TabPanels = styled.div.attrs({ 'data-component-id': 'TabPanels' })`
	width: 100%;
	flex-basis: 100%;

    ${props => breakpointUp(props.theme.breakpoints.lg, css`
        width: auto;
	    flex-basis: auto;
	    flex-grow: 1;
    `)};
`;

// @ts-ignore
export const TabContentWrapper = styled.div.attrs((props: EachTabProps) => ({
	role: 'tabpanel',
	id: `panel-${props.tabKey}`,
	'aria-labelledby': `button-${props.tabKey}`,
	'aria-expanded': props.open,
	'tabIndex': props.open ? 0 : -1
}))<EachTabProps>`
	height: 100%;
	display: ${props => props.open ? 'block' : 'none'};

    ${props => breakpointUp(props.theme.breakpoints.lg, css`
        padding-left: 0;
    `)};
`;

export const TabContentInner = styled(Row) `
	align-items: unset;
	height: 100%;
`;

export const ContentList = styled(Col)`
	
    ${props => breakpointUp(props.theme.breakpoints.lg, css`
	    padding: 0;
       	width: 40%;
	    flex-basis: 40%;
    `)};
`;

export const ContentDetail = styled(Col)`
    border: 1px solid ${props => transparentize(0.5, props.theme.colors.reverseSubtle)};
	border-radius: 0.25rem;
	margin-bottom: ${props => props.theme.spacing.md};
	
    ${props => breakpointUp(props.theme.breakpoints.lg, css`
       	width: 60%;
	    flex-basis: 60%;
    `)};
	
	[data-component-id="Loading"]:only-child {
		height: 100%;
	}
`;

