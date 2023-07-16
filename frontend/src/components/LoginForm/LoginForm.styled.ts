import styled from 'styled-components';
import { StyledForm } from '../common.styled.ts';

export const LoginFormWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	
	${StyledForm} {
        width: 25rem;
	}
`;
