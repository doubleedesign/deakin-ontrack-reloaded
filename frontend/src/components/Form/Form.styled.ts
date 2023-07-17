import styled from 'styled-components';
import { readableColor } from 'polished';

export const StyledForm = styled.form.attrs({ 'data-component-id': 'StyledForm' })`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	
    div {
	    width: 100%;
	    flex-basis: 100%;
	    margin-bottom: ${({ theme }): string => theme.spacing.md};
	    display: flex;
	    flex-wrap: wrap;
	    
		label {
			display: block;
			font-size: 0.85rem;
			padding-bottom: 2px;
		}
	    
	    &:has(button) {
		    justify-content: flex-end;
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

