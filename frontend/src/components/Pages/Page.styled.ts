import styled, { css } from 'styled-components';
import { breakpointUp } from '@doubleedesign/styled-media-queries';
import { Row } from '../common.styled.ts';

export interface PageWrapperProps {
	color: string;
}

export const PageWrapper = styled.section<PageWrapperProps>`
    width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
    flex-grow: 1;
    background: ${({ theme }): string => theme.colors.contentBackground};
	border-top: ${props => props.color ? `1rem solid ${props.color}` : ''};
    max-width: 1140px;
    margin: 0 auto;
    border-radius: 0.4rem;
    box-shadow: 0 0 0.25rem 0 ${({ theme }): string => theme.colors.reverseSubtle};
    position: relative;
    z-index: 10;
	
	h2 {
        color: ${props => props.color};
        font-weight: 700;
    }
	
	> ${Row} {
		//flex-grow: 1;
	}
`;
