import styled, { css } from 'styled-components';
import { Col, FullWidthRow, Row } from '../../components/common.styled.ts';
import { breakpointUp } from '@doubleedesign/styled-media-queries';

export const DashboardHeading = styled.h2`
	padding: 0 ${props => props.theme.spacing.md};
    margin-top: ${props => props.theme.spacing.lg};
    margin-bottom: ${props => props.theme.spacing.sm};
	
	span {
		font-weight: 300;
	}
`;

export const SubjectSummarySection = styled.section`
	max-width: 1440px;
	margin: 0 auto;
	padding-top: ${props => props.theme.spacing.lg};
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

