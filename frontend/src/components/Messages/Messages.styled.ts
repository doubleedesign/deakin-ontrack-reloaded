import styled from 'styled-components';

export const MessagesWrapper = styled.div`
	margin: ${({ theme }): string => theme.spacing.md} 0;
	
	:last-child {
		margin-bottom: 0;
	}
`;
