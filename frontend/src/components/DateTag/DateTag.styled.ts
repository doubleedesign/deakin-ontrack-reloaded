import styled from 'styled-components';
import { lighten, tint, readableColor } from 'polished';

export const DateWrapperDay = styled.span``;

export const DateWrapperMonth = styled.span``;

export const DateWrapper = styled.div<{color:string}>`
	display: flex;
	flex-direction: column;
	text-align: center;
	min-width: 3rem;
	
	${DateWrapperDay} {
        background: ${props => tint(0.9, props.theme.colors[props.color])};
		color: ${props => props.theme.colors[props.color]};
		font-weight: 700;
		font-size: 2rem;
		padding: ${({ theme }): string => theme.spacing.xs};
	}
	
	${DateWrapperMonth} {
        background: ${props => tint(0.4, props.theme.colors[props.color])};
        color: ${props => readableColor(props.theme.colors[props.color])};
        font-weight: 700;
        font-size: 1rem;
        padding: ${({ theme }): string => theme.spacing.xs};
	}
`;
