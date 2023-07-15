import styled from 'styled-components';
import { Col } from '../common.styled.ts';

export const SubjectSummaryWrapper = styled(Col).attrs({ as: 'article' })`
	width: 100%;
	flex-basis: 100%;
	margin-bottom: ${({ theme }): string => theme.spacing.lg};
`;

