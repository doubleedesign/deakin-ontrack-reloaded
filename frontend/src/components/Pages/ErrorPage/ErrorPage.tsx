import React, { FC } from 'react';
import { useRouteError } from 'react-router-dom';
import { Row } from '../../common.styled.ts';
import Page from '../Page.tsx';
import Alert from '../../Alert/Alert.tsx';

const ErrorPage: FC = () => {
	const error: any = useRouteError();
	console.error(error);

	return (
		<Page>
			<Row>
				<h2>Something went wrong</h2>
				<Alert type="error"><p>Well, this is an unfortunate turn of events.</p></Alert>
			</Row>
		</Page>
	);
};

export default ErrorPage;
