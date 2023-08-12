import styled, { css } from 'styled-components';
import { Col } from '../common.styled.ts';
import { darken, readableColor, transparentize } from 'polished';
import { PropsWithRef } from 'react';
import { getColorForStatus, isHexColor } from '../../utils.ts';

export const CardWrapper = styled(Col).attrs({ 'data-component-id': 'CardWrapper' })`
	width: 100%;
	flex-basis: 100%;
	max-width: 100%;
	display: flex;
    position: relative;
    margin-bottom: ${({ theme }): string => theme.spacing.md};
`;

export const CardInner = styled.div.attrs({ 'data-component-id': 'CardInner' })<PropsWithRef<{withBorder?: string | null}>>`
	width: 100%;
    padding: ${({ theme }): string => theme.spacing.md};
    font-size: 0.9rem;
    border: 1px solid ${props => transparentize(0.5, props.theme.colors.reverseSubtle)};
	border-left: ${props => props.withBorder ? `0.5rem solid ${props.withBorder}` : null};
	border-radius: 0.25rem;
	display: flex;
	flex-wrap: wrap;
    background: ${props => props.theme.colors.contentBackground};
	transition: all 0.3s ease;

    > div {
        flex-grow: 1;
	    overflow-x: hidden;
    }

    h3 {
        font-size: 1.125rem;
        margin-bottom: ${({ theme }): string => theme.spacing.xs};
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2; 
        line-clamp: 2;
        -webkit-box-orient: vertical;
    }
	
	p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
		
		strong {
			font-weight: 600;
		}
	}
`;

export const CardButton = styled.button<{active: boolean, color: string}>`
	width: 100%;
	appearance: none;
	background: transparent;
	border: 0;
    text-align: unset;
	font-family: ${props => props.theme.fonts.body};
	cursor: pointer;
	transition: all 0.3s ease;
	
	${CardInner} {
        background: ${props => props.active ? (isHexColor(props.color) ? props.color : props.theme.colors[props.color]) : props.theme.colors.contentBackground};
       	border-color: ${props => props.active && props.theme.colors.logo};
        box-shadow: ${props => props.active && `0 0 0.125rem 1px ${props.theme.colors.logo}`};
		
		* {
            color: ${props => props.active && readableColor((isHexColor(props.color) ? props.color : props.theme.colors[props.color]))};
		}
	}
	
	&:focus-visible {
        outline: none;
		opacity: 1;

        ${CardInner} {
            box-shadow: inset 0 0 0 0.125rem ${props => props.theme.colors.logo};
        }
	}
	
	&:hover {
		opacity: 1;
		
		${CardInner} {
            box-shadow: 0 0 0.125rem 1px ${props => props.theme.colors.reverseSubtle};
        }
	}
`;
