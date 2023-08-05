import styled from 'styled-components';
import { lighten, tint, readableColor, meetsContrastGuidelines, shade } from 'polished';
import { isHexColor } from '../../../utils.ts';

function customTextColor(bgColor: string, theme: { colors: { [x: string]: string; }; }) {
	let theColor: string;
	if(isHexColor(bgColor)) {
		theColor = bgColor;
	}
	else {
		theColor = theme.colors[bgColor];
	}
	const scores = meetsContrastGuidelines(shade(0.2, (theColor)), '#FFF');
	if(scores.AALarge) {
		return '#FFF';
	}
	return readableColor(shade(0.1, (theColor)));
}

export const DateWrapper = styled.div<{color:string}>`
	display: inline-flex;
	text-align: center;
    background: ${props => tint(0, props.theme.colors[props.color])};
    color: ${props => customTextColor(props.theme.colors[props.color], props.theme)};
	font-weight: 600;
	padding: ${props => props.theme.spacing.xs};
	margin-right: ${props => props.theme.spacing.sm};
`;
