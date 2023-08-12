import styled from 'styled-components';

export const AssignmentDetailWrapper = styled.div`
	padding-top: ${props => props.theme.spacing.md};
	padding-bottom: ${props => props.theme.spacing.md};
`;

export const AssignmentDetailText = styled.div`
	padding-bottom: ${props => props.theme.spacing.lg};
	border-bottom: 1px solid ${props => props.theme.colors.light};
	margin-bottom: ${props => props.theme.spacing.lg};
	
	h2 {
		font-size: 1.4rem;
		color: ${props => props.theme.colors.bodyText};
		margin-bottom: ${props => props.theme.spacing.md};
	}
`;

export const AssignmentDetailButtons = styled.div`
	display: flex;
	
	button:last-child {
		margin-right: 0;
	}
`;
