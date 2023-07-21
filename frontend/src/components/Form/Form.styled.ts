import styled, { css } from 'styled-components';
import { readableColor } from 'polished';

const inputStatusClasses = () => {
	return ['success', 'warning', 'error'].map(className => {
		return css`
            div.${className} {
                input {
                    border-color: ${({ theme }): string => theme.colors[className]};

                    &:focus, &:focus-visible {
                        box-shadow: 0 0 0.25rem 0 ${({ theme }): string => theme.colors[className]};
                    }
                }

                svg {
                    color: ${({ theme }): string => theme.colors[className]};;
                }
	            
	            .${className}-message {
                    color: ${({ theme }): string => theme.colors[className]};
                    font-weight: 600;
                    display: block;
                    width: 100%;
                    font-size: 0.8rem;
                    padding: ${({ theme }): string => theme.spacing.xs};
                    text-align: right;

                    & + svg {
                        bottom: 2rem;
                    }
	            }
            }
		`;
	});
};

export const StyledForm = styled.form.attrs({ 'data-component-id': 'StyledForm' })`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
    ${inputStatusClasses};
	
    div {
	    width: 100%;
	    flex-basis: 100%;
	    margin-bottom: ${({ theme }): string => theme.spacing.md};
	    display: flex;
	    flex-wrap: wrap;
	    position: relative;
	    
		label {
			display: block;
			font-size: 0.85rem;
			padding-bottom: 2px;
		}
	    
	    &:has(button) {
		    justify-content: flex-end;
	    }
	    
	    svg {
		    font-size: 1.5rem;
            position: absolute;
            bottom: 0.5rem;
            right: 0.5rem;
	    }
    }

    input {
        font-family: ${({ theme }): string => theme.fonts.body};
	    
	    &[type="text"],
	    &[type="email"],
	    &[type="number"] {
            background: ${({ theme }): string => theme.colors.pageBackground};
		    border: 1px solid  ${({ theme }): string => theme.colors.reverseSubtle};
		    border-radius: 0.25rem;
		    color: ${({ theme }): string => readableColor(theme.colors.pageBackground)};
		    width: 100%;
		    line-height: 1.8;
		    padding: ${({ theme }): string => theme.spacing.sm};

		    &:focus, &:focus-visible {
			    outline: none;
			    border-color: ${({ theme }): string => theme.colors.secondary};
			    box-shadow: 0 0 0.25rem 0 ${({ theme }): string => theme.colors.secondary};
		    }
	    }
    }
`;

