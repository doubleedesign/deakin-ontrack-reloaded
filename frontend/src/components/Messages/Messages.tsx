import React, { FC, useContext } from 'react';
import { AppContext } from '../../context/AppContextProvider.tsx';
import { Row, Col } from '../common.styled.ts';
import Alert from '../Alert/Alert.tsx';
import { MessagesWrapper } from './Messages.styled.ts';

const Messages: FC = () => {
	const { errors } = useContext(AppContext);

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
							<Alert key={`error-${index}`}
							       type="error"
							       message={messageOutput}
							       more={error.extensions?.stacktrace as string}
							/>
						);
					})}
				</Col>
			</Row>
		</MessagesWrapper>
	);
};

export default Messages;
