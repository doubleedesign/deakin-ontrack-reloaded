import React, { FC } from 'react';
import { useRouteError } from 'react-router-dom';
import { Panel, Row } from '../common.styled.ts';

const ErrorPage: FC = () => {
	const error: any = useRouteError();
	console.error(error);

	return (
		<Row>
			<h1>{error?.statusText}</h1>
			<p><strong>Well, this is an unfortunate turn of events.</strong></p>
			<p>{error?.statusMessage}</p>
		</Row>
	);
};

export default ErrorPage;
