import React, { FC, useContext } from 'react';
import { Col, Row, ScreenReaderText } from '../common.styled.ts';
import { AppContext } from '../../context/AppContextProvider.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HeaderUserLinkItem, HeaderUserLinks, HeaderWrapper, LogoNavLink } from './Header.styled';
import { ButtonStyledAsLink } from '../Button/Button.styled.ts';
import NotificationToggle from './NotificationToggle/NotificationToggle.tsx';
import ThemeToggle from './ThemeToggle/ThemeToggle.tsx';

const Header: FC = () => {
	const { queryOptions, setDrawerOpen, clearCredentials } = useContext(AppContext);

	return (
		<HeaderWrapper>
			<Row>
				<Col>
					<LogoNavLink to='/'>
						<h1><img src="/ontrack-reloaded.svg" alt=""/>OnTrack <span>Reloaded</span></h1>
					</LogoNavLink>
				</Col>
				<HeaderUserLinks>
					<ul>
						<HeaderUserLinkItem hasDivider={true}>
							<ButtonStyledAsLink onClick={() => setDrawerOpen('settings')}>
								<FontAwesomeIcon icon={['fas', 'user-gear']}/>
								<ScreenReaderText>Close panel</ScreenReaderText>
							</ButtonStyledAsLink>
						</HeaderUserLinkItem>
						{queryOptions &&
							<HeaderUserLinkItem>
								<ButtonStyledAsLink onClick={clearCredentials}>Log out</ButtonStyledAsLink>
							</HeaderUserLinkItem>
						}
						<HeaderUserLinkItem>
							<NotificationToggle/>
						</HeaderUserLinkItem>
						<HeaderUserLinkItem>
							<ThemeToggle/>
						</HeaderUserLinkItem>
					</ul>
				</HeaderUserLinks>
			</Row>
		</HeaderWrapper>
	);
};

export default Header;
