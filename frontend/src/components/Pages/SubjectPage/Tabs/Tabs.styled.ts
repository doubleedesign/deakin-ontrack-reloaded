import styled, { css } from 'styled-components';
import { Row, Col } from '../../../common.styled.ts';
import { breakpointUp } from '@doubleedesign/styled-media-queries';
import { readableColor, shade } from 'polished';
import { StyledButton } from '../../../Button/Button.styled.ts';
import { ButtonGroupWrapper } from '../../../ButtonGroup/ButtonGroup.styled.ts';

export const TabSection = styled(Row)`
	display: flex;
	flex-wrap: wrap;
	align-items: flex-start;
	margin-bottom: ${props => props.theme.spacing.lg};

    ${props => breakpointUp(props.theme.breakpoints.lg, css`
        flex-wrap: nowrap;
    `)};
`;

export const TabNavWrapper = styled(Col).attrs({ as: 'nav' })`
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
        color: ${props => props.color ? readableColor(props.theme.colors[props.color]) : 'unset'};
		
		svg {
            color: ${props => props.color ? readableColor(props.theme.colors[props.color]) : 'currentColor'};
		}
	}
`;

export const TabPanels = styled.div`
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
	display: ${props => props.open ? 'block' : 'none'};

    ${props => breakpointUp(props.theme.breakpoints.lg, css`
        padding-left: 0;
    `)};
`;
