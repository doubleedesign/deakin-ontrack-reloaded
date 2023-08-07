import styled, { css } from 'styled-components';
import { Col, Row } from '../../components/common.styled.ts';
import { breakpointUp } from '@doubleedesign/styled-media-queries';

export const DashboardHeading = styled.h2`
	padding: 0 ${props => props.theme.spacing.md};
    margin-top: ${props => props.theme.spacing.lg};
    margin-bottom: ${props => props.theme.spacing.sm};
	
	span {
		font-weight: 300;
	}
`;

export const SubjectsSummary = styled(Row).attrs({ as : 'section' })`
	padding: 0;
	
    ${props => breakpointUp(props.theme.breakpoints.lg, css`
        > ${Col} {
	        width: 25%;
	        flex-basis: 25%;
	        flex-grow: 1;
        }
    `)};
`;

export const AssignmentsSummary = styled(Col).attrs({ as : 'section' })`

    ${Col} {
        padding: 0;
    }
`;
