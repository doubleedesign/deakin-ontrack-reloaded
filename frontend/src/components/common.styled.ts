import styled, { css } from 'styled-components';
import { darken, readableColor } from 'polished';
import { breakpointUp } from '@doubleedesign/styled-media-queries';

export const AppWrapper = styled.div`
	width: 100vw;
	min-height: 100vh;
	background: ${({ theme }): string => theme.colors.pageBackground};
	color: ${({ theme }): string => theme.colors.bodyText};
    font-family: ${({ theme }): string => theme.fonts.body};
	overflow-x: hidden;
`;

// TODO: Work out how to make container queries work!
export const Container = styled.div`
	container-name: nearest-container;
	container-type: size;
`;

export const Panel = styled.div`
	padding: ${({ theme }): string => theme.spacing.lg} 0;

    ${props => breakpointUp(props.theme.breakpoints.lg, css`
        padding-top: ${({ theme }): string => theme.spacing.xl};
        padding-bottom: ${({ theme }): string => theme.spacing.xl}
    `)};

    ${props => breakpointUp(props.theme.breakpoints.xl, css`
        padding-top: ${({ theme }): string => theme.spacing.xxl};
        padding-bottom: ${({ theme }): string => theme.spacing.xxl}
    `)};
`;

export const Row = styled.div`
	display: flex;
	max-width: 1280px;
	margin: 0 auto;
	padding: 0 ${({ theme }): string => theme.spacing.sm};
	position: relative;
`;

export const Col = styled.div`
	position: relative;
	padding: 0 ${({ theme }): string => theme.spacing.sm};

    ${props => breakpointUp(props.theme.breakpoints.lg, css`
        padding: 0 ${({ theme }): string => theme.spacing.md};
    `)};
`;

export const UnitCode = styled.span`
`;

export const ScreenReaderText = styled.span`
    border: 0;
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    word-wrap: normal !important;
`;

export const StyledForm = styled.form`
	display: flex;
	align-items: flex-end;
	
    div {
	    padding-right: ${({ theme }): string => theme.spacing.xs};
	    
		label {
			display: block;
			font-size: 0.75rem;
			padding-bottom: 2px;
		}
    }

    input {
        font-family: ${({ theme }): string => theme.fonts.body};
	    
	    &[type="text"],
	    &[type="email"],
	    &[type="number"] {
            background: ${({ theme }): string => theme.colors.pageBackground};
		    border: 1px solid  ${({ theme }): string => theme.colors.reverseSubtle};
		    color: ${({ theme }): string => readableColor(theme.colors.pageBackground)};
		    width: 100%;
		    line-height: 1.8;
		    padding: ${({ theme }): string => theme.spacing.xs};

		    &:focus, &:focus-visible {
			    outline: none;
			    border-color: ${({ theme }): string => theme.colors.secondary};
			    box-shadow: 0 0 0.25rem 0 ${({ theme }): string => theme.colors.secondary};
		    }
	    }
    }
`;

interface ButtonProps {
	color: string;
}

export const Button = styled.button<ButtonProps>`
    appearance: none;
    font-family: ${({ theme }): string => theme.fonts.body};
	font-weight: 600;
    background: ${({ color, theme }): string => theme.colors[color]};
    color: ${({ color, theme }): string => readableColor(darken(0.1, theme.colors[color]))};
	border: 0;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-block;
	padding: ${({ theme }): string => theme.spacing.sm} ${({ theme }): string => theme.spacing.lg};
	text-decoration: underline;
	text-decoration-color: transparent;
	
	&:hover, &:focus, &:active {
		background: ${({ color, theme }): string => darken(0.1, theme.colors[color])};
        color: ${({ color, theme }): string => readableColor(darken(0.1, theme.colors[color]))};
	}
	
	&:focus {
        text-decoration-color: currentColor;
	}
`;
