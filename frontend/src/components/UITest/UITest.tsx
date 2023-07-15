import React, { FC } from 'react';
import { Panel, Row, Col } from '../common.styled.ts';
import { ColorBox, TabExampleRow, ColorWheelRow } from './UITest.styled.ts';

// @ts-ignore
const UiTest: FC = () => {
	return (
		<>
			<Panel>
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
				<Row>
					<ColorBox className="success">Success</ColorBox>
					<ColorBox className="info">Info</ColorBox>
					<ColorBox className="warning">Warning</ColorBox>
					<ColorBox className="error">Error</ColorBox>
				</Row>
			</Panel>
			<Panel>
				<Row>
					<Col>
						<h2>Example subject tabs</h2>
					</Col>
				</Row>
				<TabExampleRow>
					{[...Array(5)].map((index) => <div key={`tab-${index}`}>ABC123</div>)}
				</TabExampleRow>
			</Panel>
			<Panel>
				<Row>
					<Col>
						<h2>adjustHue() results - Theme primary colour</h2>
					</Col>
				</Row>
				<ColorWheelRow color="primary">
					{[...Array(25)].map((index) => <div key={index+1}/>)}
				</ColorWheelRow>
			</Panel>
			<Panel>
				<Row>
					<Col>
						<h2>adjustHue() results - Theme success colour</h2>
					</Col>
				</Row>
				<ColorWheelRow color="success">
					{[...Array(25)].map((index) => <div key={index+1}/>)}
				</ColorWheelRow>
			</Panel>
			<Panel>
				<Row>
					<Col>
						<h2>adjustHue() results - Theme secondary colour</h2>
					</Col>
				</Row>
				<ColorWheelRow color="secondary">
					{[...Array(25)].map((index) => <div key={index+1}/>)}
				</ColorWheelRow>
			</Panel>
		</>

	);
};

export default UiTest;
