import styled, { css } from 'styled-components';
import { Col, FullWidthRow, Row } from '../../components/common.styled.ts';
import { breakpointUp } from '@doubleedesign/styled-media-queries';

export const SubjectSummarySection = styled.section`
	max-width: 1440px;
	margin: 0 auto;
	padding-top: ${props => props.theme.spacing.xl};
	padding-bottom: ${props => props.theme.spacing.lg};
`;

export const SubjectsSummary = styled(FullWidthRow)`
	padding: 0;
	justify-content: flex-start;
	
    ${props => breakpointUp(props.theme.breakpoints.lg, css`
        > ${Col} {
	        width: 25%;
	        flex-basis: 25%;
	        flex-grow: 1;
        }
    `)};
`;

