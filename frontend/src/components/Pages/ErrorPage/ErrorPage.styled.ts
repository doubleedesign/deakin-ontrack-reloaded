import styled from 'styled-components';

export const ErrorPageContent = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	
	svg {
		color: ${props => props.theme.colors.error};
		font-size: 3em;
		margin-bottom: ${props => props.theme.spacing.md};
	}

	h2 {
        color: ${props => props.theme.colors.error};
		margin-bottom: ${props => props.theme.spacing.md};
	}
	
	p {
		
		strong {
			font-weight: 600;
		}
	}
`;
