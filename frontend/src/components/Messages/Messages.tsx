import React, { FC, ReactNode, useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContextProvider.tsx';
import { Row, Col } from '../common.styled.ts';
import Alert from '../Alert/Alert.tsx';
import { MessagesWrapper } from './Messages.styled.ts';
import { StyledButton } from '../Button/Button.styled.ts';
import { useQuery } from '@apollo/client';
import { PERSISTENT_CACHE_STATUS_QUERY } from '../../graphql/queries.ts';

const Messages: FC = () => {
	const { errors, authenticated, setUserDrawerOpen } = useContext(AppContext);
	const cacheStatus = useQuery(PERSISTENT_CACHE_STATUS_QUERY, { fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache' });
	const [cacheMessages, setCacheMessages] = useState<ReactNode[]>([]);

	useEffect(() => {
		const messages: ReactNode[] = [];
		Object.entries(authenticated?.isAuthenticated).map(([systemName, isAuthenticated]) => {
			if(!isAuthenticated) {
				// @ts-ignore
				const cachedDate = cacheStatus?.data?.persistentCacheStatus[systemName];
				if(cachedDate) {
					messages.push(
						<Alert type="warning" key={`warning-${systemName}`}>
							<div>
								<p><strong>{systemName} is not authenticated.</strong></p>
								<p><span>Data is being loaded from a file saved on {new Intl.DateTimeFormat('en-AU', {
									timeZone: 'Australia/Sydney',
									weekday: 'long',
									day: 'numeric',
									month: 'long',
									year: 'numeric'
								}).format(cachedDate)}. This data may not be complete or current.</span></p>
							</div>
							<StyledButton color="warning" onClick={() => setUserDrawerOpen(true)}>Authenticate</StyledButton>
						</Alert>
					);
				}
				else {
					messages.push(
						<Alert type="error" key={`error-${systemName}`}>
							<div>
								<p><strong>{systemName} is not authenticated, and there is no saved file to load from.</strong></p>
							</div>
							<StyledButton color="error" onClick={() => setUserDrawerOpen(true)}>Authenticate</StyledButton>
						</Alert>
					);
				}
			}
		});
		setCacheMessages(messages);
	}, [authenticated, cacheStatus, setUserDrawerOpen]);

	return (
		<MessagesWrapper data-component-id="Messages">
			<Row>
				<Col>
					{cacheMessages && cacheMessages.map((message: React.ReactNode | undefined, index: number) => {
						return message;
					})}
					{errors && errors.map((error, index) => {
						console.error(new Error(`${error.extensions?.code} ${error.message} ${error.extensions?.stacktrace as string}`).message);
						let messageOutput = `${error.extensions?.code} ${error.message}`;
						if(error.extensions.url) {
							messageOutput = messageOutput + `(at URL ${error.extensions?.url})`;
						}
						return (
							<Alert key={`error-${index}`} type="error">
								<div>
									<p><strong>{messageOutput}</strong>&nbsp;</p>
									<p><span>{error.extensions?.stacktrace as string}</span></p>
								</div>
								{[401, 403, 419].includes(error?.extensions?.code as number) &&
									<StyledButton color="error" onClick={() => setUserDrawerOpen(true)}>Authenticate</StyledButton>
								}
							</Alert>
						);
					})}
				</Col>
			</Row>
		</MessagesWrapper>
	);
};

export default Messages;
