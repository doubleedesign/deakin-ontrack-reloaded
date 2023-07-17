import styled from 'styled-components';

interface OverlayProps {
	open: boolean;
}

export const OverlayElement = styled.div<OverlayProps>`
	width: 100vw;
	height: 100vh;
	position: fixed;
	inset: 0 0 0 0;
	background: rgba(0,0,0,0.65);
	z-index: ${props => props.open ? '200' : '-1'};
	opacity: ${props => props.open ? '1' : '0' };
	transition: all 0.2s ease;
`;
