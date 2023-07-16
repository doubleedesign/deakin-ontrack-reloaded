import React, { FC, useCallback, useContext } from 'react';
import { HeaderWrapper, LogoNavLink, LogoutLink } from './Header.styled';
import { Col, Row } from '../common.styled.ts';
import ThemeToggle from '../ThemeToggle/ThemeToggle.tsx';
import { AppContext } from '../../context/AppContextProvider.tsx';

const Header: FC = () => {
	const { queryOptions } = useContext(AppContext);

	const logOut = useCallback(function(event: any) {
		event.preventDefault();
		alert('Still gotta build the logout functionality!');
	}, []);

	return (
		<HeaderWrapper>
			<Row>
				<Col>
					<LogoNavLink to='/'>
						<h1><img src="/ontrack-reloaded.svg" alt=""/>OnTrack <span>Reloaded</span></h1>
					</LogoNavLink>
				</Col>
				{queryOptions && <LogoutLink onClick={logOut}>Log out</LogoutLink>}
				<ThemeToggle/>
			</Row>
		</HeaderWrapper>
	);
};

export default Header;
