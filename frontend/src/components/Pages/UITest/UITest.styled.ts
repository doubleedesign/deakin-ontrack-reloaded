import styled, { css } from 'styled-components';
import { complement, adjustHue, readableColor, lighten, darken, shade, desaturate, tint, parseToRgb } from 'polished';
import { Col, Row } from '../../common.styled.ts';

const names = ['success', 'info', 'warning', 'error'];

const namedColorBlocks = (theme: any) => names.map((item) => css`
	&.${item} {
		background: ${theme.colors[item]};
		color: ${readableColor(theme.colors[item])};
	}
`);

// @ts-ignore
export const ColorBox = styled(Col)`
	width: auto;
	flex-grow: 1;
	height: 120px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-weight: 600;
	margin: 0.25rem;
	
	${props => namedColorBlocks(props.theme)};
`;

const exampleTabColorGen = (color: string) => [...Array(5)].map((x, index) => {
	const genColor = index % 2 === 0
		? adjustHue(360 - (index * 15), color)
		: adjustHue((index * 15) + 245, color);

	return css`
        div:nth-of-type(${index+1}) {
            background: ${genColor};
	        color: ${readableColor(genColor)};
        }
	`;
});

export const TabExampleRow = styled(Row)`
	margin-bottom: 2rem;
	margin-top: 1rem;
	
	div {
		width: 120px;
		padding: 0.5rem 1rem;
		margin-right: 0.25rem;
		text-align: center;
		font-weight: 600;
	}
	
    ${props => exampleTabColorGen('#a007a6')};
`;

const colorWheel = (color: string) => [...Array(25)].map((x, index) => {
	return css`
	    div:nth-of-type(${index+1}) {
	        background: ${adjustHue(index * 15, color)};
		    
		    &:before {
			    content: 'Hue ${index * 15}';
			    color: ${readableColor(adjustHue(index * 15, color))}		    
		    }
	    };
		div:first-of-type {
			background: ${color};
		}
	`;
});

export const ColorWheelRow = styled(Row)<{color: string}>`
	margin-bottom: 2rem;
	margin-top: 1rem;
	
	div {
		width: auto;
		flex-grow: 1;
		height: 120px;
		position: relative;
		
		&:before {
			position: absolute;
			inset: 0 0 0 0;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 0.8rem;
		}
	}
	
    ${props => colorWheel(props.theme.colors[props.color])};
`;
