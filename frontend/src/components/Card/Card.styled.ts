import styled, { css } from 'styled-components';
import { Col } from '../common.styled.ts';
import { transparentize } from 'polished';
import { PropsWithRef } from 'react';

export const CardWrapper = styled(Col).attrs({ 'data-component-id': 'CardWrapper' })`
	width: 100%;
	flex-basis: 100%;
	max-width: 100%;
	display: flex;
    position: relative;
	
`;
export const CardInner = styled.div<PropsWithRef<{withBorder?: string | null}>>`
	width: 100%;
    padding: ${({ theme }): string => theme.spacing.md};
    margin-bottom: ${({ theme }): string => theme.spacing.md};
    font-size: 0.9rem;
    border: 1px solid ${props => transparentize(0.5, props.theme.colors.reverseSubtle)};
	border-left: ${props => props.withBorder ? `0.5rem solid ${props.withBorder}` : null};
	border-radius: 0.25rem;
	display: flex;
	flex-wrap: wrap;
    background: ${props => props.theme.colors.contentBackground};

    > div {
        flex-grow: 1;
    }

    h3 {
        font-size: 1.125rem;
        margin-bottom: ${({ theme }): string => theme.spacing.xs};
    }
	
	p {
		
		strong {
			font-weight: 600;
		}
	}
`;
