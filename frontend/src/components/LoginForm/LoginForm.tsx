import React, { FC, useContext, useState, useCallback,useEffect } from 'react';
import { LoginFormWrapper } from './LoginForm.styled';
import { AppContext } from '../../context/AppContextProvider.tsx';
import { StyledForm } from '../Form/Form.styled.ts';
import { StyledButton } from '../Button/Button.styled.ts';
import { SystemName } from '../../types.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocalStorage } from '../../hooks/useLocalStorage.ts';

const LoginForm: FC = () => {
	const { setCredentials, authenticated, setUserDrawerOpen } = useContext(AppContext);
	const { value: username } = useLocalStorage<string | null>('otr_username', null);
	const { value: otToken } = useLocalStorage<string | null>('otr_token', null);
	const { value: dsToken } = useLocalStorage<string | null>('ds_token', null);
	const { value: cdToken } = useLocalStorage<string | null>('cd_token', null);

	async function handleCredentials(event: React.FormEvent<HTMLFormElement>) {
		const result = await setCredentials(event);
		if(result?.authenticated.length >= 3) {
			setUserDrawerOpen(false);
		}
	}

	function getClassName(system: SystemName) {
		if(authenticated && authenticated?.authenticated.includes(system)) {
			return 'success';
		}
		if(authenticated && authenticated?.errors.find(error => error.extensions.systemName === system)) {
			return 'error';
		}
	}

	function error(system: SystemName) {
		const error = authenticated?.errors.find(error => error.extensions.systemName === system);
		if(error) {
			return `${error?.extensions.code} ${error?.extensions.statusText}`;
		}

		return undefined;
	}

	function success(system: SystemName) {
		return authenticated && authenticated?.authenticated.includes(system);
	}

	return (
		<LoginFormWrapper>
			<StyledForm onSubmit={handleCredentials}>
				<div className={getClassName('OnTrack')}>
					<label htmlFor="username">Username</label>
					<input id="username" name="username" type="text" defaultValue={username || ''}/>
					{success('OnTrack') &&  <FontAwesomeIcon icon={['fas', 'circle-check']}/>}
					{error('OnTrack') &&
						<>
							<span className="error-message">{`${error('OnTrack')}`}</span>
							<FontAwesomeIcon icon={['fas', 'circle-exclamation']}/>
						</>
					}
				</div>
				<div className={getClassName('OnTrack')}>
					<label htmlFor="otToken">OnTrack Auth-Token</label>
					<input id="otToken" name="otToken" type="text" defaultValue={otToken || ''}/>
					{success('OnTrack') &&  <FontAwesomeIcon icon={['fas', 'circle-check']}/>}
					{error('OnTrack') &&
						<>
							<span className="error-message">{`${error('OnTrack')}`}</span>
							<FontAwesomeIcon icon={['fas', 'circle-exclamation']}/>
						</>
					}
				</div>
				<div className={getClassName('DeakinSync')}>
					<label htmlFor="dsToken">DeakinSync bearer token</label>
					<input id="dsToken" name="dsToken" type="text" defaultValue={dsToken || ''}/>
					{success('DeakinSync') &&  <FontAwesomeIcon icon={['fas', 'circle-check']}/>}
					{error('DeakinSync') &&
						<>
							<span className="error-message">{`${error('DeakinSync')}`}</span>
							<FontAwesomeIcon icon={['fas', 'circle-exclamation']}/>
						</>
					}
				</div>
				<div className={getClassName('CloudDeakin')}>
					<label htmlFor="cdToken">CloudDeakin (D2L) bearer token</label>
					<input id="cdToken" name="cdToken" type="text" defaultValue={cdToken || ''}/>
					{success('CloudDeakin') &&  <FontAwesomeIcon icon={['fas', 'circle-check']}/>}
					{error('CloudDeakin') &&
						<>
							<span className="error-message">{`${error('CloudDeakin')}`}</span>
							<FontAwesomeIcon icon={['fas', 'circle-exclamation']}/>
						</>
					}
				</div>
				<div>
					<StyledButton type="submit" color="primary">Let's go</StyledButton>
				</div>
			</StyledForm>
		</LoginFormWrapper>
	);
};

export default LoginForm;
