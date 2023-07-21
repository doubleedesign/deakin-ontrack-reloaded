import styled from 'styled-components';
import { StatusColor } from '../../types.ts';

export const AlertWrapper = styled.div<{type: StatusColor, size?: string}>`
	border: 1px solid ${props => props.theme.colors[props.type]};
	border-left-width: ${({ theme }): string => theme.spacing.sm};
	border-radius: 0.25rem;
	width: 100%;
	padding: ${props => props.size === 'small' ? props.theme.spacing.xs : props.theme.spacing.sm};
	background: ${props => props.size === 'small' ? 'transparent' : props.theme.colors.contentBackground};
    margin-bottom: ${({ theme }): string => theme.spacing.sm};
	display: flex;
	align-items: flex-start;
	font-size: ${props => props?.size === 'small' ? '0.8rem' : 'inherit'};
	
	&:last-child {
        margin-bottom: ${({ theme }): string => theme.spacing.lg};
	}
	
	div {
		flex-grow: 0;
		flex-shrink: 1;
		padding-right: ${({ theme }): string => theme.spacing.lg};
	}

    p {
        &:last-of-type {
            margin-bottom: 0;
        }
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
		flex-grow: 0;
		flex-shrink: 0;
		margin-left: auto;
	}
`;
