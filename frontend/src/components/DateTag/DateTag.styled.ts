import styled from 'styled-components';
import { lighten, tint, readableColor } from 'polished';
export const DateWrapper = styled.div<{color:string}>`
	display: inline-flex;
	text-align: center;
    background: ${props => tint(0, props.theme.colors[props.color])};
    color: ${props => readableColor(props.theme.colors[props.color])};
	font-weight: 600;
	padding: ${props => props.theme.spacing.xs};
	margin-right: ${props => props.theme.spacing.sm};
`;
