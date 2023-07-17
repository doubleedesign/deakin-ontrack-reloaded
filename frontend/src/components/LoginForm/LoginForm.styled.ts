import styled from 'styled-components';
import { StyledForm } from '../Form/Form.styled.ts';

export const LoginFormWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	
	${StyledForm} {
        width: 25rem;
	}
	
	[data-lastpass-icon-root] {
		margin: 0;
	}
`;
