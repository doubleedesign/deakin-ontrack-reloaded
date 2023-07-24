import styled from 'styled-components';
import { darken, meetsContrastGuidelines, readableColor, shade } from 'polished';
import { isHexColor } from '../../utils.ts';
interface ButtonProps {
	color: string;
	rounded?: boolean;
}

interface LinkProps {
	href: string;
	target?: string;
}

export const StyledButton = styled.button<ButtonProps>`
    appearance: none;
    font-family: ${({ theme }): string => theme.fonts.body};
	font-weight: 600;
	border-radius: ${props => props.rounded ? '3rem' : '0.25rem'};
    background: ${props => isHexColor(props.color) ? props.color : props.theme.colors[props.color]};
    color: ${props => {
		let theColor: string;
		if(isHexColor(props.color)) {
			theColor = props.color;
		}
		else {
			theColor = props.theme.colors[props.color];
		}
		const scores = meetsContrastGuidelines(shade(0.1, (theColor)), '#FFF');
		if(scores.AALarge) {
			return '#FFF';
		}
		return readableColor(shade(0.1, (theColor)));
	}};
    font-size: 0.9rem;
	border: 0;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-block;
	padding: ${({ theme }): string => theme.spacing.sm} ${({ theme }): string => theme.spacing.lg};
	line-height: 1.6;
	text-decoration: underline;
	text-decoration-color: transparent;
	margin-right: ${({ theme }): string => theme.spacing.sm};
	
	svg {
		padding-left: ${({ theme }): string => theme.spacing.sm};
	}
	
	&:hover, &:focus, &:active {
		background: ${props => darken(0.15, isHexColor(props.color) ? props.color : props.theme.colors[props.color])};
	}
	
	&:focus {
        text-decoration-color: currentColor;
	}
`;

export const StyledIconButton = styled(StyledButton)`
    padding: ${({ theme }): string => theme.spacing.sm} ${({ theme }): string => theme.spacing.md};
	
	svg {
		margin: 0;
		padding: 0;
		font-size: 1.25rem;
	}
`;

export const LinkStyledAsButton = styled(StyledButton).attrs({ as: 'a' })<LinkProps>``;

export const ButtonStyledAsLink = styled.button`
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

    svg {
        font-size: 1rem;
    }

    &:hover, &:focus-visible {
        color: ${({ theme }): string => theme.colors.info};
        text-decoration-color: currentColor;
    }
`;

