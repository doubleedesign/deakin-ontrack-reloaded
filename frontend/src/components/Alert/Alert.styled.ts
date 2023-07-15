import styled from 'styled-components';
import { StatusColor } from '../../types.ts';

export const AlertWrapper = styled.div<{type: StatusColor}>`
	border: 1px solid ${props => props.theme.colors[props.type]};
	border-left-width: ${({ theme }): string => theme.spacing.sm};
	border-radius: 0.25rem;
	width: 100%;
	padding: ${({ theme }): string => theme.spacing.md};
	background: ${({ theme }): string => theme.colors.contentBackground};
    margin-bottom: ${({ theme }): string => theme.spacing.sm};
	
	&:last-child {
        margin-bottom: ${({ theme }): string => theme.spacing.lg};
	}
	
	strong {
		font-weight: 600;
		color: ${props => props.theme.colors[props.type]};
	}
`;
