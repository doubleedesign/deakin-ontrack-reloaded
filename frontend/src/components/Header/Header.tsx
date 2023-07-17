import React, { FC, useContext } from 'react';
import { HeaderLinkButton, HeaderUserLinks, HeaderWrapper, LogoNavLink } from './Header.styled';
import { Col, Row, ScreenReaderText } from '../common.styled.ts';
import ThemeToggle from '../ThemeToggle/ThemeToggle.tsx';
import { AppContext } from '../../context/AppContextProvider.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Header: FC = () => {
	const { queryOptions, setUserDrawerOpen, clearCredentials } = useContext(AppContext);

	return (
		<HeaderWrapper>
			<Row>
				<Col>
					<LogoNavLink to='/'>
						<h1><img src="/ontrack-reloaded.svg" alt=""/>OnTrack <span>Reloaded</span></h1>
					</LogoNavLink>
				</Col>
				<HeaderUserLinks>
					<HeaderLinkButton onClick={() => setUserDrawerOpen(true)}>
						<FontAwesomeIcon icon={['fas', 'user-gear']}/>
						<ScreenReaderText>Close panel</ScreenReaderText>
					</HeaderLinkButton>
					{queryOptions && <HeaderLinkButton onClick={clearCredentials}>Log out</HeaderLinkButton>}
				</HeaderUserLinks>
				<ThemeToggle/>
			</Row>
		</HeaderWrapper>
	);
};

export default Header;
