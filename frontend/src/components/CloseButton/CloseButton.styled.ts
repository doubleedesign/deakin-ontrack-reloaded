import styled from 'styled-components';

export const CloseButtonElement = styled.button`
	cursor: pointer;
	font-size: 1.5rem;
	line-height: 1;
	padding: ${({ theme }): string => theme.spacing.xs} ${({ theme }): string => theme.spacing.sm};
	background: transparent;
	border: 1px solid transparent;
	transition: all 0.3s ease;
	border-radius: 0.25rem;
	
	&:hover, &:focus-visible {
		background: ${({ theme }): string => theme.colors.pageBackground};
		border-color: currentColor;
	}
`;
