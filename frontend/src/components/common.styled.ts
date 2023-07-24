import styled, { css } from 'styled-components';
import { breakpointUp } from '@doubleedesign/styled-media-queries';

export const AppWrapper = styled.div`
	width: 100vw;
	min-height: 100vh;
	padding: 0 ${({ theme }): string => theme.spacing.md};
    padding-bottom: ${({ theme }): string => theme.spacing.xl};
	display: flex;
	flex-direction: column;
	background: ${({ theme }): string => theme.colors.pageBackground};
	color: ${({ theme }): string => theme.colors.bodyText};
    font-family: ${({ theme }): string => theme.fonts.body};
	overflow-x: hidden;
`;

// TODO: Work out how to make container queries work!
export const Container = styled.section`
	container: layout inline-size;
    container-name: nearest-container;
`;

export const Row = styled.div.attrs({ 'data-component-id': 'Row' })`
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	flex-basis: 100%;
    max-width: 1140px;
	margin: 0 auto;
	padding: 0 ${({ theme }): string => theme.spacing.sm};
	position: relative;
`;

export const Col = styled.div.attrs({ 'data-component-id': 'Col' })`
	position: relative;
	padding: 0 ${({ theme }): string => theme.spacing.sm};
	flex-grow: 1;

    ${props => breakpointUp(props.theme.breakpoints.lg, css`
        padding: 0 ${({ theme }): string => theme.spacing.md};
    `)};
`;

export const UnitCode = styled.span`
`;

export const ScreenReaderText = styled.span`
    border: 0;
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    word-wrap: normal !important;
`;
