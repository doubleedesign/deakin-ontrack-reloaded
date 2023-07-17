import React, { FC, useContext } from 'react';
import { AppContext } from '../../context/AppContextProvider.tsx';
import { Row, Col } from '../common.styled.ts';
import Alert from '../Alert/Alert.tsx';
import { MessagesWrapper } from './Messages.styled.ts';
import LoginForm from '../LoginForm/LoginForm.tsx';

const Messages: FC = () => {
	const { errors, setUserDrawerOpen } = useContext(AppContext);

	return (
		<MessagesWrapper data-component-id="Messages">
			<Row>
				<Col>
					{errors && errors.map((error, index) => {
						console.error(`${error.extensions?.code} ${error.message} ${error.extensions?.stacktrace as string}`);
						let messageOutput = `${error.extensions?.code} ${error.message}`;
						if(error.extensions.url) {
							messageOutput = messageOutput + `(at URL ${error.extensions?.url})`;
						}
						return (
							<Alert key={`error-${index}`} type="error">
								<p><strong>{messageOutput}</strong></p>
								{error?.extensions?.code === 401 ?
									<>
										<p>You might want to try re-entering your credentials.</p>
										<button onClick={() => setUserDrawerOpen(true)}>Log in again</button>
									</>
									: ''}
								<p><span>{error.extensions?.stacktrace as string}</span></p>
							</Alert>
						);
					})}
				</Col>
			</Row>
		</MessagesWrapper>
	);
};

export default Messages;
