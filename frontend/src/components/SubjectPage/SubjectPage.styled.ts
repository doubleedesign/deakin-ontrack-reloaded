import styled from 'styled-components';
import { Col, Panel } from '../common.styled.ts';

export const PageContent = styled(Col).attrs({ as: 'main' })`
	width: 100%;
	flex-basis: 100%;
	
	${Panel} {
        background: ${({ theme }): string => theme.colors.contentBackground};
		border-radius: ${({ theme }): string => theme.spacing.sm};
	}
`;
