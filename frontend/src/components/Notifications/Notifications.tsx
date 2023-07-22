import React, { FC, ReactNode, useContext, useEffect, useState } from 'react';
import { NotificationsWrapper } from './Notifications.styled.ts';
import Alert from '../Alert/Alert.tsx';
import { StyledButton } from '../Button/Button.styled.ts';
import { useQuery } from '@apollo/client';
import { PERSISTENT_CACHE_STATUS_QUERY } from '../../graphql/queries.ts';
import { AppContext } from '../../context/AppContextProvider.tsx';


const Notifications: FC = () => {
	const { setDrawerOpen, authenticated } = useContext(AppContext);
	const [cacheMessages, setCacheMessages] = useState<ReactNode[]>([]);
	const cacheStatus = useQuery(PERSISTENT_CACHE_STATUS_QUERY, { fetchPolicy: 'no-cache', nextFetchPolicy: 'no-cache' });

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
							<StyledButton color="warning" onClick={() => setDrawerOpen('settings')}>Authenticate</StyledButton>
						</Alert>
					);
				}
				else {
					messages.push(
						<Alert type="error" key={`error-${systemName}`}>
							<div>
								<p><strong>{systemName} is not authenticated, and there is no saved file to load from.</strong></p>
							</div>
							<StyledButton color="error" onClick={() => setDrawerOpen('settings')}>Authenticate</StyledButton>
						</Alert>
					);
				}
			}
		});
		setCacheMessages(messages);
	}, [authenticated, cacheStatus, setDrawerOpen]);

	return (
		<NotificationsWrapper>
			{cacheMessages && cacheMessages.map((message: React.ReactNode | undefined) => {
				return message;
			})}
		</NotificationsWrapper>
	);
};

export default Notifications;
