import React, { FC, useContext, useState, useEffect } from 'react';
import SubjectSummary from '../../SubjectSummary/SubjectSummary.tsx';
import { AppContext } from '../../../context/AppContextProvider.tsx';
import { Row } from '../../common.styled.ts';
import Page from '../Page.tsx';
import LoginForm from '../../Form/LoginForm/LoginForm.tsx';
import { darkTheme, lightTheme } from '../../../theme.ts';

const Dashboard: FC = () => {
	const { currentSubjects, authenticated, queryOptions, theme, drawerOpen } = useContext(AppContext);
	const themeObject = theme === 'light' ? lightTheme : darkTheme;
	const [showLogin, setShowLogin] = useState<boolean>(false);

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
			<Row>
				{ (showLogin && !drawerOpen) && <LoginForm /> }
				{ queryOptions && currentSubjects && currentSubjects.map(subject => {
					return <SubjectSummary key={subject.projectId} subject={subject}/>;
				})}
			</Row>
		</Page>
	);
};

export default Dashboard;
