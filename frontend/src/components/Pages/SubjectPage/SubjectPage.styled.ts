import styled, { css } from 'styled-components';
import { Col, Row } from '../../common.styled.ts';
import { meetsContrastGuidelines, shade, readableColor, tint, transparentize, darken } from 'polished';
import { isHexColor } from '../../../utils.ts';

export const SubjectHeaderRow = styled(Row).attrs({ as: 'header' })<{color: string}>`
	padding: ${props => props.theme.spacing.lg} 0;
	justify-content: space-between;
	align-items: center;
	background: ${props => transparentize(0.9, props.color)};
	
	${Col} {
		flex-grow: 0;
	}
	
	h2 {
        span {
            display: inline-block;
	        line-height: 1;
            background: ${props => props.color};
            font-weight: 300;
            padding: ${({ theme }): string => theme.spacing.sm};
            margin-right: ${({ theme }): string => theme.spacing.sm};
            color: ${props => meetsContrastGuidelines(shade(0.4, props.color), '#FFF').AA ? '#FFF' : readableColor(props.color)};
	        position: relative;
	        
	        &:before {
		        content: '';
		        background: ${props => props.color};
		        width: ${({ theme }): string => theme.spacing.lg};
		        position: absolute;
		        top: 0;
		        bottom: 0;
		        left: -${({ theme }): string => theme.spacing.lg};
	        }
        }
	}
`;

export const SubjectViewToggles = styled.div`
	margin: ${props => props.theme.spacing.lg} 0;
	
	> div + div {
		margin-top: ${props => props.theme.spacing.sm};
	}
`;

export const SubjectViewToggleRow = styled(Row).attrs({ 'data-component-id': 'SubjectViewToggleRow' })`
	justify-content: flex-end;
	align-items: center;
`;

export const SubjectViewToggle = styled(Col).attrs({ 'data-component-id': 'SubjectViewToggle' })<{color:string, current?:number}>`
    display: flex;
    justify-content: flex-end;
    align-items: center;
	flex-grow: 0;

    p, label {
        font-size: 0.875rem;
        margin: 0;
        margin-right: ${({ theme }): string => theme.spacing.sm};
    }
	
	.selectBox {
		width: 190px;
		border: 1px solid ${props => tint(0.6, props.theme.colors.reverseSubtle)};
		border-radius: 0.25rem;
		font-size: 0.9rem;
		
		[class*="ValueContainer"] {
			padding-left: ${props => props.theme.spacing.sm};
			cursor: pointer;
		}
		
		[class*="IndicatorsContainer"] {
			padding-right: ${props => props.theme.spacing.sm};
			cursor: pointer;
		}

        [class*="MenuList"] {
	        background: ${props => props.theme.colors.contentBackground};
            box-shadow: 0 0 0.25rem 0 ${({ theme }): string => theme.colors.reverseSubtle};
	        border-bottom-right-radius: 0.25rem;
	        border-bottom-left-radius: 0.25rem;
        }

        [class*="option"] {
			padding: ${props => props.theme.spacing.xs};
	        cursor: pointer;
	        font-size: 0.9rem;
	        transition: all 0.2s ease;
	        
	        &:hover, &:focus-visible {
		        background: ${props => props.color};
                color: ${props => {
		let theColor: string;
		if(isHexColor(props.color)) {
			theColor = props.color;
		}
		else {
			theColor = props.theme.colors[props.color];
		}
		const scores = meetsContrastGuidelines(shade(0.1, (theColor)), '#FFF');
		if(scores.AALarge) {
			return '#FFF';
		}
		return readableColor(shade(0.1, (theColor)));
	}};
	        }
        }
		
		${props => props?.current && css`
			[id*="option-${props.current}"] {
                // @ts-ignore
                background: ${props => props.theme.color};
                color: ${props => {
		let theColor: string;
		if(isHexColor(props.color)) {
			theColor = props.color;
		}
		else {
			theColor = props.theme.colors[props.color];
		}
		const scores = meetsContrastGuidelines(shade(0.1, (theColor)), '#FFF');
		if(scores.AALarge) {
			return '#FFF';
		}
		return readableColor(shade(0.1, (theColor)));
	}};
			}
		`};
	}
`;

export const CheckboxLabel = styled.label`
	cursor: pointer;
	display: flex;
	align-items: center;
	
	svg {
		font-size: 2rem;
		margin-left: ${props => props.theme.spacing.sm};
        clip-path: inset(0.25rem 0 0.25rem 0);
        background: ${props => darken(0.1, props.theme.colors.light)};
		border-radius: 100%;

		&.fa-toggle-large-on {
			
			path.fa-secondary {
				fill: white;
			}

            path.fa-secondary {
                fill: ${props => props.theme.colors.success};
	            opacity: 1;
            }
        }
		
		&.fa-toggle-large-off {

            path.fa-secondary {
                fill: white;
            }

            path.fa-secondary {
                fill: ${props => darken(0.1, props.theme.colors.light)};
                opacity: 1;
            }
        }
	}
	
	& + input[type="checkbox"] {
        position: absolute;
        opacity: 0;
    }
`;
