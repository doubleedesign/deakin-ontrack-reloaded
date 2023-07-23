import styled from 'styled-components';
import { shade, transparentize } from 'polished';

export const CardWrapper = styled.div<{color: string}>`
	width: 100%;
	flex-basis: 100%;
	padding: ${({ theme }): string => theme.spacing.md};
	border-radius: 0.25rem;
	margin-bottom: ${({ theme }): string => theme.spacing.md};
    box-shadow: 0 0 0.5rem 0 ${props => transparentize(0.6, shade(0.5, props.theme.colors[props.color]))};
	display: flex;
    font-size: 0.9rem;
	
	[data-component-id="IconForStatus"] {
		font-size: 1.5rem;
		margin-right: ${({ theme }): string => theme.spacing.sm};
	}
	
	div:first-of-type {
		flex-grow: 1;
		padding: 0 ${({ theme }): string => theme.spacing.sm};
	}

    h3 {
        color: ${props => props.theme.colors[props.color]};
	    font-size: 1.125rem;
	    margin-bottom: ${({ theme }): string => theme.spacing.xs};
    }
`;
