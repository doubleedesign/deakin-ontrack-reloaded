import React, { FC } from 'react';
import { useRouteError } from 'react-router-dom';
import { Row } from '../common.styled.ts';
import Page from '../Page/Page.tsx';
import Alert from '../Alert/Alert.tsx';

const ErrorPage: FC = () => {
	const error: any = useRouteError();
	console.error(error);

	return (
		<Page>
			<Row>
				<h1>{error?.statusText}</h1>
				<Alert type="error" message="Well, this is an unfortunate turn of events."/>
			</Row>
		</Page>
	);
};

export default ErrorPage;
