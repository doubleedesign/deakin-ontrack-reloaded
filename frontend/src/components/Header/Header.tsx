import React, { FC, useContext } from 'react';
import { HeaderWrapper } from './Header.styled';
import { Button, Col, Row, StyledForm } from '../common.styled.ts';
import { AppContext } from '../../context/AppContextProvider.tsx';
import ThemeToggle from '../ThemeToggle/ThemeToggle.tsx';
const Header: FC = () => {
	const { setCredentials, queryOptions } = useContext(AppContext);

	return (
		<HeaderWrapper>
			<Row>
				<Col>
					<h1><img src="/ontrack-reloaded.svg" alt=""/>OnTrack <span>Reloaded</span></h1>
				</Col>
				<Col>
					<StyledForm onSubmit={(event) => setCredentials(event)}>
						<div>
							<label htmlFor="username">Username</label>
							<input id="username" name="username" type="text" defaultValue={queryOptions?.context?.headers?.username}/>
						</div>
						<div>
							<label htmlFor="token">Auth-Token</label>
							<input id="token" name="token" type="text" defaultValue={queryOptions?.context?.headers['Auth-Token']}/>
						</div>
						<Button type="submit" color="secondary">Let's go</Button>
					</StyledForm>
				</Col>
				<ThemeToggle/>
			</Row>
		</HeaderWrapper>
	);
};

export default Header;
