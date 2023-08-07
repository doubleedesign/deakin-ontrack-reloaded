import styled from 'styled-components';
import { lighten } from 'polished';

export const DateDataWrapper = styled.div`
    border-top: 1px solid ${props => lighten(0.35, props.theme.colors.reverseSubtle)};
	display: flex;
	align-items: center;
	padding-top: ${props => props.theme.spacing.xs};
	
	[data-component-id="IconForStatus"] {
		margin-right: ${props => props.theme.spacing.sm};
		font-size: 1rem;
	}
	
	p {
		padding: 0;
		margin: 0;
	}
`;
