import styled from 'styled-components';

export const IconForStatusWrapper = styled.span<{ color: string }>`
	
	svg {
        font-size: 1.25em;
		color: ${props => props.theme.colors[props.color]};
	}
`;
