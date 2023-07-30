import styled from 'styled-components';

export const IconForStatusWrapper = styled.span<{ color: string, className?: string }>`
	
	svg {
        font-size: 1.25em;
		color: ${props => props.theme.colors[props.color]};
	}
	
	&.icon-pass {
		transform: rotate(90deg);
	}
	
	&.icon-credit {
		transform: rotate(180deg);
	}
	
	&.icon-distinction {
		transform: rotate(270deg);
	}
`;
