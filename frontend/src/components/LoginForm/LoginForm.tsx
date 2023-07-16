import React, { FC, useContext } from 'react';
import { LoginFormWrapper } from './LoginForm.styled';
import { Button, StyledForm } from '../common.styled.ts';
import { AppContext } from '../../context/AppContextProvider.tsx';
import Alert from '../Alert/Alert.tsx';


const LoginForm: FC = () => {
	const { setCredentials, queryOptions } = useContext(AppContext);

	return (
		<LoginFormWrapper>
			<StyledForm onSubmit={(event) => setCredentials(event)}>
				<Alert type="warning" message="Hey, I'm gonna need to see some ID."/>
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
					<Button type="submit" color="primary">Let's go</Button>
				</div>
			</StyledForm>
		</LoginFormWrapper>
	);
};

export default LoginForm;
