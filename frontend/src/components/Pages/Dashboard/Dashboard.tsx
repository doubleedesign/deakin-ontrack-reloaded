import React, { FC, useContext, useState, useEffect } from 'react';
import { AppContext } from '../../../context/AppContextProvider.tsx';
import { Row } from '../../common.styled.ts';
import Page from '../Page.tsx';
import LoginForm from '../../Form/LoginForm/LoginForm.tsx';
import { darkTheme, lightTheme } from '../../../theme.ts';
import Messages from '../../Messages/Messages.tsx';
import Loading from '../../Loading/Loading.tsx';

const Dashboard: FC = () => {
	const { clearMessages, currentSubjects, authenticated, theme, drawerOpen } = useContext(AppContext);
	const themeObject = theme === 'light' ? lightTheme : darkTheme;
	const [showLogin, setShowLogin] = useState<boolean>(false);

	useEffect(() => {
		clearMessages();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if(authenticated?.isAuthenticated) {
			if((Object.values(authenticated?.isAuthenticated).every(item => item === false))) {
				setShowLogin(true);
			}
			else {
				setShowLogin(false);
			}
		}
	}, [authenticated?.isAuthenticated]);

	return (
		<Page color={themeObject.colors.logo}>
			<Messages/>
			<Row>
				{ (showLogin && !drawerOpen) && <LoginForm /> }
				<Loading/>
			</Row>
		</Page>
	);
};

export default Dashboard;
