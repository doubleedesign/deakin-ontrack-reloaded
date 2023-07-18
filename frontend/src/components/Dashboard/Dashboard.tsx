import React, { FC, useContext } from 'react';
import SubjectSummary from '../SubjectSummary/SubjectSummary.tsx';
import { AppContext } from '../../context/AppContextProvider.tsx';
import { Row } from '../common.styled.ts';
import Page from '../Page/Page.tsx';
import LoginForm from '../LoginForm/LoginForm.tsx';
import { darkTheme, lightTheme } from '../../theme.ts';

const Dashboard: FC = () => {
	const { currentSubjects, authenticated, queryOptions, theme, userDrawerOpen } = useContext(AppContext);
	const themeObject = theme === 'light' ? lightTheme : darkTheme;

	return (
		<Page color={themeObject.colors.logo}>
			<Row>
				{ (authenticated?.authenticated.length !== 3 && !userDrawerOpen) && <LoginForm /> }
				{ queryOptions && currentSubjects && currentSubjects.map(subject => {
					return <SubjectSummary key={subject.projectId} subject={subject}/>;
				})}
			</Row>
		</Page>
	);
};

export default Dashboard;
