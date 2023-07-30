import React, { FC } from 'react';
import { useRouteError } from 'react-router-dom';
import { Row } from '../../common.styled.ts';
import Page from '../Page.tsx';
import Alert from '../../Alert/Alert.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorPageContent } from './ErrorPage.styled.ts';
import ErrorStackParser, { StackFrame } from 'error-stack-parser';

const ErrorPage: FC = () => {
	const error: Error = useRouteError() as Error;
	const data: StackFrame[] = ErrorStackParser.parse(error);

	function trimFileUrl(url: string) {
		let trimmed = url.replace(window.location.origin, '');
		trimmed = trimmed.split('?')[0];

		return trimmed;
	}

	return (
		<Page>
			<Row style={{ flexGrow: '1' }}>
				<ErrorPageContent>
					<FontAwesomeIcon icon={['fas', 'circle-exclamation']}/>
					<h2>Something went wrong</h2>
					<p>Well, this is an unfortunate turn of events. Apparently <strong>{error.message}</strong>.</p>
					<p>This error was thrown by {trimFileUrl(data[0].fileName as string)} on line {data[0].lineNumber}.</p>
				</ErrorPageContent>
			</Row>
		</Page>
	);
};

export default ErrorPage;
