import styled, { css } from 'styled-components';
import { Col, Row } from '../../components/common.styled.ts';
import { breakpointUp } from '@doubleedesign/styled-media-queries';

export const SubjectsSummary = styled(Row).attrs({ as : 'section' })`
	margin: ${props => props.theme.spacing.lg} 0;
`;

export const AssignmentsSummary = styled(Col).attrs({ as : 'section' })`
    margin: ${props => props.theme.spacing.lg} 0;

    ${Col} {
        padding: 0;
    }
`;
