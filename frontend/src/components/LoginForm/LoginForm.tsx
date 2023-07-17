import React, { FC, useContext } from 'react';
import { LoginFormWrapper } from './LoginForm.styled';
import { AppContext } from '../../context/AppContextProvider.tsx';
import Alert from '../Alert/Alert.tsx';
import { StyledButton } from '../Button/Button.styled.ts';
import { StyledForm } from '../Form/Form.styled.ts';


const LoginForm: FC = () => {
	const { setCredentials, queryOptions } = useContext(AppContext);

	return (
		<LoginFormWrapper>
			<StyledForm onSubmit={(event) => setCredentials(event)}>
				{(!queryOptions?.context.headers['Auth-Token']
					|| !queryOptions?.context.headers.Authorization
					|| !queryOptions.context.headers.username) &&
					<Alert type="warning"><p><strong>Hey, I'm gonna need to see some ID.</strong></p></Alert>
				}
				<div>
					<label htmlFor="username">Username</label>
					<input id="username" name="username" type="text" defaultValue={queryOptions?.context?.headers?.username}/>
				</div>
				<div>
					<label htmlFor="otToken">OnTrack Auth-Token</label>
					<input id="otToken" name="otToken" type="text" defaultValue={queryOptions?.context?.headers['Auth-Token']}/>
				</div>
				<div>
					<label htmlFor="dsToken">DeakinSync bearer token</label>
					<input id="dsToken" name="dsToken" type="text" defaultValue={queryOptions?.context?.headers['Authorization']}/>
				</div>
				<div>
					<StyledButton type="submit" color="primary">Let's go</StyledButton>
				</div>
			</StyledForm>
		</LoginFormWrapper>
	);
};

export default LoginForm;
