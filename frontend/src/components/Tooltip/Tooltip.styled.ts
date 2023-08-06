import styled from 'styled-components';
import { readableColor, shade, transparentize } from 'polished';

export const TooltipWrapper = styled.div`
	position: absolute;
	inset: 0 0 0 0;
	cursor: pointer;
    transition: all 0.2s ease;
    height: ${props => props.theme.spacing.lg}; // hack for current use case, may need updating for future use
	
	> div {
		position: absolute;
		top: calc(100% + 0.5rem);
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		pointer-events: none;
		opacity: 0;
		z-index: -1;
		transition: all 0.2s ease;
		
		> span {
            display: inline-block;
            background: ${props => props.theme.colors.reverse};
            padding: ${props => props.theme.spacing.sm};
            color: ${props => readableColor(props.theme.colors.reverse)};
            line-height: 1;
			white-space: nowrap;
			position: relative;
			
			&:before {
				content: '';
                width: 0;
                height: 0;
                border-style: solid;
                border-width: 0 0.75rem 0.5rem 0.75rem;
                border-color: transparent transparent ${props => props.theme.colors.reverse} transparent;
				position: absolute;
				top: -0.5rem;
				left: calc(50% - 0.75rem);
			}
		}
	}
	
	&:hover {
		background: ${props => transparentize(0.2, shade(0.1, props.theme.colors.light))};
		
		> div {
			opacity: 1;
			z-index: 100;
		}
	}
`;
