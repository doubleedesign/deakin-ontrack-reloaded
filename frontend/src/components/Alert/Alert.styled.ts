import styled from 'styled-components';
import { StatusColor } from '../../types.ts';

export const AlertWrapper = styled.div<{type: StatusColor}>`
	border: 1px solid ${props => props.theme.colors[props.type]};
	border-left-width: ${({ theme }): string => theme.spacing.sm};
	border-radius: 0.25rem;
	width: 100%;
	padding: ${({ theme }): string => theme.spacing.sm};
	background: ${({ theme }): string => theme.colors.contentBackground};
    margin-bottom: ${({ theme }): string => theme.spacing.sm};
	display: flex;
	align-items: flex-start;
	
	&:last-child {
        margin-bottom: ${({ theme }): string => theme.spacing.lg};
	}
	
	div {
		flex-grow: 0;
		flex-shrink: 1;
	}
	
	strong {
		font-weight: 600;
		color: ${props => props.theme.colors[props.type]};
	}
	
	span {
		font-size: 0.8em;
		opacity: 0.75;
	}
	
	button {
		flex-grow: 1;
		flex-shrink: 0;
	}
`;
