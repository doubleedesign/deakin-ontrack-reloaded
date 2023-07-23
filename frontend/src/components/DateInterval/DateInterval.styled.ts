import styled from 'styled-components';
import { lighten } from 'polished';

export const DateIntervalWrapper = styled.p<{color: string}>`
    color: ${props => props.theme.colors[props.color]};
	font-size: 0.875rem;
	line-height: 1;
	display: inline-block;
	margin-top: ${({ theme }): string => theme.spacing.sm};
	padding-top: ${({ theme }): string => theme.spacing.sm};
	border-top: 1px solid ${props => lighten(0.3, props.theme.colors.reverseSubtle)};
	
	strong {
        font-family: ${({ theme }): string => theme.fonts.accent};
		font-size: 1.25rem;
		line-height: 0;
		position: relative;
		top: 2px;
		display: inline-block;
		margin-left: 0.25rem;
    }
`;
