import React, { FC } from 'react';
import { Row, Col } from '../common.styled.ts';
import { ColorBox, TabExampleRow, ColorWheelRow } from './UITest.styled.ts';
import Page from '../Page/Page.tsx';

// @ts-ignore
const UiTest: FC = () => {
	return (
		<Page>
			<Row>
				<Col>
					<h2>Main colour theme</h2>
				</Col>
			</Row>
			<Row>
				<ColorBox className="primary">Primary</ColorBox>
				<ColorBox className="secondary">Secondary</ColorBox>
				<ColorBox className="accent">Accent</ColorBox>
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
				</Col>
			</Row>
			<TabExampleRow>
				{[...Array(5)].map((index) => <div key={`tab-${index}`}>ABC123</div>)}
			</TabExampleRow>
			<Row>
				<Col>
					<h2>adjustHue() results - Theme primary colour</h2>
				</Col>
			</Row>
			<ColorWheelRow color="primary">
				{[...Array(25)].map((index) => <div key={index+1}/>)}
			</ColorWheelRow>
			<Row>
				<Col>
					<h2>adjustHue() results - Theme success colour</h2>
				</Col>
			</Row>
			<ColorWheelRow color="success">
				{[...Array(25)].map((index) => <div key={index+1}/>)}
			</ColorWheelRow>
			<Row>
				<Col>
					<h2>adjustHue() results - Theme secondary colour</h2>
				</Col>
			</Row>
			<ColorWheelRow color="secondary">
				{[...Array(25)].map((index) => <div key={index+1}/>)}
			</ColorWheelRow>
		</Page>

	);
};

export default UiTest;
