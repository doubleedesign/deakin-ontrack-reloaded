import styled from 'styled-components';
import { darken, meetsContrastGuidelines, readableColor, shade } from 'polished';
interface ButtonProps {
	color: string;
}

export const StyledButton = styled.button<ButtonProps>`
    appearance: none;
    font-family: ${({ theme }): string => theme.fonts.body};
	font-weight: 600;
	border-radius: 0.25rem;
    background: ${({ color, theme }): string => theme.colors[color]};
    color: ${({ color, theme }): string => {
		const scores = meetsContrastGuidelines(shade(0.1, theme.colors[color]), '#FFF');
		if(scores.AALarge) {
			return '#FFF';
		}
		return readableColor(shade(0.1, theme.colors[color]));
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
		background: ${({ color, theme }): string => darken(0.15, theme.colors[color])};
	}
	
	&:focus {
        text-decoration-color: currentColor;
	}
`;

interface LinkProps {
	href: string;
	target?: string;
}

export const StyledButtonLink = styled(StyledButton).attrs({ as: 'a' })<LinkProps>``;
