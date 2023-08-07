import styled, { css } from 'styled-components';
import { Col } from '../common.styled.ts';
import { transparentize } from 'polished';
import { PropsWithRef } from 'react';

export const CardWrapper = styled(Col)`
	width: 100%;
	flex-basis: 100%;
	max-width: 100%;
	display: flex;
    position: relative;
	
`;

export const CardImage = styled.div`
    width: 100%;
    height: 180px;
  
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center center;
    }
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
