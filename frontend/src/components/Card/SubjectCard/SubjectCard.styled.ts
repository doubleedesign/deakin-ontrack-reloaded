import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';
import { darken, readableColor } from 'polished';
import { isHexColor } from '../../../utils.ts';
import { PropsWithRef } from 'react';

interface SubjectHeadingProps extends PropsWithRef<any> {
	color: string;
}

export const SubjectHeading = styled.h3<SubjectHeadingProps>`
    display: block;
    color: ${props => props.color};
    font-weight: 700;
	margin-left: -${props => props.theme.spacing.md};
	white-space: nowrap;
	overflow-x: hidden;
	text-overflow: ellipsis;
    
    span {
        background: ${props => props.color};
        color: ${props => readableColor(props.color)};
	    display: inline-block;
	    padding: ${props => props.theme.spacing.sm};
	    line-height: 1;
    }
`;

export const SubjectLink = styled(NavLink)<{color: string}>`
	display: inline-block;
	border-radius: 0.25rem;
	position: relative;
	background: ${props => props.color};
	color: ${props => readableColor(props.color)};
	font-weight: 600;
    padding: ${({ theme }): string => theme.spacing.sm} ${({ theme }): string => theme.spacing.lg};
    line-height: 1.6;
    text-decoration: underline;
    text-decoration-color: transparent;
    transition: all 0.2s ease;
	margin-left: auto;
	width: auto;
	flex-basis: auto;
	
	svg {
		margin-left: ${props => props.theme.spacing.xs};
        transition: all 0.2s ease;
	}

    &:hover, &:focus, &:active {
        background: ${props => darken(0.15, isHexColor(props.color) ? props.color : props.theme.colors[props.color])};
    
	    svg {
	    }
    }

    &:focus {
        text-decoration-color: currentColor;
    }
`;

export const ProgressBarGroup = styled.figure.attrs({ role: 'group' })`
	width: 100%;
	
	> div {
        width: 100%;
        display: flex;
        flex-wrap: nowrap;
    }
`;

interface ProgressBarProps {
	color: string;
	completePercentage: number;
	width?: number;
}

export const ProgressBar = styled.figure.attrs({ 'data-component-id': 'ProgressBar' })<ProgressBarProps>`
	width: ${props => `${props.width}%` ?? '100%'};
	flex-basis: ${props => `${props.width}%` ?? '100%'};
	margin: ${props => props.theme.spacing.md} 0;
	position: relative;
	
	> div {
		width: 100%;
        height: ${props => props.theme.spacing.lg};
        background: ${props => props.theme.colors.light};
        position: relative;
		
		&:before, &:after {
            content: '';
            position: absolute;
		}
		
		&:before {
			left: 0;
			display: block;
            width: ${props => `${props.completePercentage}%`};
			height: 100%;
            background: ${props => props.color};
		}
		
		&:after {
            border-right: 2px solid ${props => darken(0.25, props.theme.colors.light)};
			right: 0;
			top: 0.25rem;
			bottom: 0.25rem;
		}
	}
	
	&:first-of-type {
		> div, > div:before {
            border-top-left-radius: 0.25rem;
            border-bottom-left-radius: 0.25rem;
        }
	}
	
	&:last-of-type {
		> div, > div:before {
            border-top-right-radius: 0.25rem;
            border-bottom-right-radius: 0.25rem;
		}
		
		> div:after {
            border-right: 0;
		}
	}
`;

export const ProgressCaption = styled.figcaption`
	display: block;
	text-align: right;
	margin-top: ${props => props.theme.spacing.xs};
	
	strong {
		font-weight: 600;
	}
`;
