import styled, { css } from 'styled-components';
import { lighten, shade, transparentize } from 'polished';
import { breakpointUp } from '@doubleedesign/styled-media-queries';
import { Col } from '../common.styled.ts';

export const CardWrapper = styled(Col)`
	width: 100%;
	flex-basis: 100%;
	max-width: 100%;
	display: flex;

    ${props => breakpointUp(props.theme.breakpoints.lg, css`
       // width: 50%;
	    //flex-basis: 50%;
	   // max-width: 50%;
    `)};
`;

export const CardInner = styled.div`
	width: 100%;
    padding: ${({ theme }): string => theme.spacing.md};
    margin-bottom: ${({ theme }): string => theme.spacing.md};
    font-size: 0.9rem;
    border: 1px solid ${props => transparentize(0.5, props.theme.colors.reverseSubtle)};
	border-radius: 0.25rem;
	display: flex;

    [data-component-id="IconForStatus"] {
	    width: 2rem;
        font-size: 1.5rem;
    }

    > div {
        flex-grow: 1;
        padding: 0 ${({ theme }): string => theme.spacing.sm};
    }

    h3 {
        font-size: 1.125rem;
        margin-bottom: ${({ theme }): string => theme.spacing.xs};
    }
`;

export const DateDataWrapper = styled.div`
    border-top: 1px solid ${props => lighten(0.35, props.theme.colors.reverseSubtle)};
`;
