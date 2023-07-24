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
	flex-wrap: wrap;
	font-size: ${props => props?.size === 'small' ? '0.8rem' : 'inherit'};

	div {
		flex-grow: 1;
		padding-right: ${({ theme }): string => theme.spacing.lg};

	    @container nearest-container (min-width: 720px) {
	        flex-grow: 0;
	        flex-shrink: 1;
	    }
	}

    p {
	    margin: ${({ theme }): string => theme.spacing.xs} 0;
	    
	    &:only-child {
		    display: flex;
		    height: 100%;
		    align-items: center;
		    margin: 0;
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
		align-self: flex-start;
		flex-grow: 0;
		flex-shrink: 0;
		margin-left: auto;
		margin-top: ${({ theme }): string => theme.spacing.md};
	}
`;
