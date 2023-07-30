import styled from 'styled-components';

export const ButtonGroupWrapper = styled.div`
	background: ${props => props.theme.colors.light};
	border: 2px solid ${props => props.theme.colors.light};
	border-radius: 0.5rem;
	box-sizing: border-box;
	
    button {
        margin: 2px;
    }
`;
