import React, { FC, useContext } from 'react';
import { LoginFormWrapper } from './LoginForm.styled.ts';
import { AppContext } from '../../../context/AppContextProvider.tsx';
import { StyledForm } from '../Form.styled.ts';
import { LoginFormField } from './LoginFormField.tsx';
import { StyledButton } from '../../Button/Button.styled.ts';
import { useLocalStorage } from '../../../hooks/useLocalStorage.ts';

const LoginForm: FC = () => {
	const { setCredentials } = useContext(AppContext);
	const { value: username } = useLocalStorage<string | null>('otr_username', null);
	const { value: otToken } = useLocalStorage<string | null>('otr_token', null);
	const { value: dsToken } = useLocalStorage<string | null>('ds_token', null);
	const { value: cdToken } = useLocalStorage<string | null>('cd_token', null);

	return (
		<LoginFormWrapper>
			<StyledForm onSubmit={setCredentials}>
				<LoginFormField system="OnTrack" name="username" label="Username" defaultValue={username || ''}/>
				<LoginFormField system="OnTrack" name="otToken" label="OnTrack Auth-Token" defaultValue={otToken || ''}/>
				<LoginFormField system="DeakinSync" name="dsToken" label="DeakinSync bearer token"  defaultValue={dsToken || ''}/>
				<LoginFormField system="CloudDeakin" name="cdToken" label="CloudDeakin bearer token" defaultValue={cdToken || ''}/>
				<div>
					<StyledButton type="submit" color="logo">Let's go</StyledButton>
				</div>
			</StyledForm>
		</LoginFormWrapper>
	);
};

export default LoginForm;
