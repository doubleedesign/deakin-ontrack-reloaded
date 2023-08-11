import styled, { css } from 'styled-components';
import { Col, Row } from '../../../components/common.styled.ts';
import { breakpointUp } from '@doubleedesign/styled-media-queries';
import { desaturate, lighten, shade, tint, transparentize } from 'polished';
import { getColorForStatus } from '../../../utils.ts';
import { CardInner } from '../../../components/Card/Card.styled.ts';
import { StyledButton } from '../../../components/Button/Button.styled.ts';

export const AssignmentsSummarySection = styled.section<{ status: string }>`
	padding-top: ${props => props.theme.spacing.lg};
	padding-bottom: ${props => props.theme.spacing.lg};
	
	&:last-child {
		background: ${props => props.theme.colors.pageBackground};
	}
	
	&:first-child {
        background: ${props => {
		if(['overdue', 'tomorrow'].includes(props.status)) {
			return desaturate(0.3, tint(0.8, props.theme.colors[getColorForStatus(props.status)]));
		}
	}};
	}

	h2 {
		font-size: 1.25rem;
		color: ${props => props.theme.colors[getColorForStatus(props.status)]};
		width: 100%;
		flex-basis: 100%;
		padding: ${props => props.theme.spacing.sm};
		
		span {
			font-weight: 300;
		}
	}
	
	${CardInner} {
        box-shadow: ${props => {
		if(['overdue', 'tomorrow'].includes(props.status)) {
			return `0 0 0.5rem 0 ${props.theme.colors[getColorForStatus(props.status)]};`;
		}
	}};
	}
	
`;

export const AssignmentsSummaryRow = styled.div`
	flex-grow: 1;

    ${Col} {
        padding: 0;
    }

    ${props => breakpointUp(props.theme.breakpoints.lg, css`
	    display: flex;
	    flex-wrap: wrap;
	    
        ${Col} {
	        width: 50%;
	        flex-basis: 50%;
	        max-width: 50%;
	        padding: 0 ${props => props.theme.spacing.sm};
        }
    `)};


    ${props => breakpointUp(props.theme.breakpoints.xl, css`
        > ${Col} {
	        width: 33.33%;
	        flex-basis: 33.33%;
            flex-grow: 0;
        }
    `)};
`;

export const ActionsRow = styled.div`
	width: 100%;
	flex-basis: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	
	span {
		font-size: 0.9rem;
        margin-right: ${props => props.theme.spacing.md};
	}
`;
