import React, { FC, useContext } from 'react';
import { AppContext } from '../../context/AppContextProvider.tsx';
import { Row, Col } from '../common.styled.ts';
import Alert from '../Alert/Alert.tsx';
import { MessagesWrapper } from './Messages.styled.ts';
import { StyledButton } from '../Button/Button.styled.ts';

const Messages: FC = () => {
	const { errors, setDrawerOpen } = useContext(AppContext);

	return (
		<MessagesWrapper data-component-id="Messages">
			<Row>
				<Col>
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
										<StyledButton color="error" onClick={() => setDrawerOpen('settings')}>Authenticate</StyledButton>
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
