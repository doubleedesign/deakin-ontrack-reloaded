import React, { FC, useContext } from 'react';
import { HeaderWrapper, LogoNavLink } from './Header.styled';
import { Button, Col, Row, StyledForm } from '../common.styled.ts';
import { AppContext } from '../../context/AppContextProvider.tsx';
import ThemeToggle from '../ThemeToggle/ThemeToggle.tsx';

const Header: FC = () => {
	const { setCredentials, queryOptions } = useContext(AppContext);

	return (
		<HeaderWrapper>
			<Row>
				<Col>
					<LogoNavLink to='/'>
						<h1><img src="/ontrack-reloaded.svg" alt=""/>OnTrack <span>Reloaded</span></h1>
					</LogoNavLink>
				</Col>
				<Col style={{ flexGrow: 0 }}>
					<StyledForm onSubmit={(event) => setCredentials(event)}>
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
						<Button type="submit" color="primary">Let's go</Button>
					</StyledForm>
				</Col>
				<ThemeToggle/>
			</Row>
		</HeaderWrapper>
	);
};

export default Header;
