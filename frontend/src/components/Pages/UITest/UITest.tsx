import React, { FC } from 'react';
import { Row, Col } from '../../common.styled.ts';
import { ColorBox, TabExampleRow, ColorWheelRow } from './UITest.styled.ts';
import Page from '../Page.tsx';

// @ts-ignore
const UiTest: FC = () => {
	return (
		<Page>
			<Row>
				<Col>
					<h2 style={{ marginTop: '2rem' }}>Semantic colours</h2>
				</Col>
			</Row>
			<Row style={{ marginBottom: '2rem' }}>
				<ColorBox className="success">Success</ColorBox>
				<ColorBox className="info">Info</ColorBox>
				<ColorBox className="warning">Warning</ColorBox>
				<ColorBox className="error">Error</ColorBox>
			</Row>
			<Row>
				<Col>
					<h2>Example subject tabs</h2>
					<TabExampleRow>
						{[...Array(5)].map((index) => <div key={`tab-${index}`}>ABC123</div>)}
					</TabExampleRow>
				</Col>
			</Row>
			<Row>
				<Col>
					<h2>adjustHue() results</h2>
					<p>Logo</p>
					<ColorWheelRow color="logo">
						{[...Array(25)].map((index) => <div key={index+1}/>)}
					</ColorWheelRow>
					<p>Tab generation starting colour</p>
					<ColorWheelRow color="accent">
						{[...Array(25)].map((index) => <div key={index+1}/>)}
					</ColorWheelRow>
					<p>Success</p>
					<ColorWheelRow color="success">
						{[...Array(25)].map((index) => <div key={index+1}/>)}
					</ColorWheelRow>
					<p>Info</p>
					<ColorWheelRow color="info">
						{[...Array(25)].map((index) => <div key={index+1}/>)}
					</ColorWheelRow>
					<p>Warning</p>
					<ColorWheelRow color="warning">
						{[...Array(25)].map((index) => <div key={index+1}/>)}
					</ColorWheelRow>
					<p>Error</p>
					<ColorWheelRow color="error">
						{[...Array(25)].map((index) => <div key={index+1}/>)}
					</ColorWheelRow>
				</Col>
			</Row>
		</Page>

	);
};

export default UiTest;
