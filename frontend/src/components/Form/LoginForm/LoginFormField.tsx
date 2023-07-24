import React, { FC, useContext, useState, useEffect } from 'react';
import { SystemName } from '../../../types.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppContext } from '../../../context/AppContextProvider.tsx';

interface LoginFormFieldProps {
	name: string;
	system: SystemName;
	label: string;
	defaultValue: string;
}

export const LoginFormField: FC<LoginFormFieldProps> = ({ name, system, label, defaultValue = '' }) => {
	const { authenticated } = useContext(AppContext);
	const [fieldStatus, setFieldStatus] = useState<string>('');
	const [message, setMessage] = useState<string|null>(null);

	useEffect(() => {
		if(authenticated.isAuthenticated[system]) {
			setFieldStatus('success');
			setMessage(null);
		}
		else {
			const warning = authenticated.errors.find(error => {
				return error?.extensions?.systemName === system && error.extensions?.statusText === 'Syntax error';
			});
			const error = authenticated.errors.find(error => {
				return error?.extensions?.systemName === system;
			});

			if(warning) {
				//console.error(`${system} authentication error: ${warning}`);
				setFieldStatus('warning');
				setMessage(`${error?.extensions.statusText}`);
			}
			else if(error) {
				//console.error(new Error(`${system} authentication error ${error?.extensions?.code}: ${error?.extensions?.statusText}`).message);
				setFieldStatus('error');
				setMessage(`${error?.extensions.statusText}`);
			}
		}
	}, [authenticated.errors, authenticated.isAuthenticated, system]);


	return (
		<div className={fieldStatus}>
			<label htmlFor={name}>{label}</label>
			<input id="username" name={name} type="text" defaultValue={defaultValue}/>
			{message && <span className={`${fieldStatus}-message`}>{message}</span>}
			{fieldStatus === 'success' && <FontAwesomeIcon icon={['fas', 'circle-check']}/>}
			{fieldStatus === 'warning' && <FontAwesomeIcon icon={['fas', 'triangle-exclamation']}/>}
			{fieldStatus === 'error' && <FontAwesomeIcon icon={['fas', 'circle-exclamation']}/>}
		</div>
	);
};
