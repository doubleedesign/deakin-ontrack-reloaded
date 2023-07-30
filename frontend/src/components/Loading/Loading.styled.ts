import styled from 'styled-components';

export const LoadingWrapper = styled.div`
	width: 100%;
	flex-grow: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	
	svg {
		font-size: 4em;
		
		&.fa-gear {
			position: relative;
			
			&:first-of-type {
				color: ${props => props.theme.colors.logo};
			}
			
			&:last-of-type {
                color: ${props => props.theme.colors.info};
				top: 0.35em;
			}
		}
	}
	
	p {
        color: ${props => props.theme.colors.logo};
        font-weight: 600;
		margin-top: 2.5em;
	}
`;
