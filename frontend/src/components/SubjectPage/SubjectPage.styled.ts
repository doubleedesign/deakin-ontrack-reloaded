import styled from 'styled-components';
import { Col, Row } from '../common.styled.ts';
import { meetsContrastGuidelines, shade, readableColor } from 'polished';

export const SubjectHeaderRow = styled(Row).attrs({ as: 'header' })<{color: string}>`
	justify-content: space-between;
	align-items: center;
	
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
