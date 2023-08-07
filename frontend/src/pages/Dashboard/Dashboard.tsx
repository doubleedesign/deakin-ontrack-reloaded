import React, { FC, useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContextProvider.tsx';
import Page from '../Page.tsx';
import LoginForm from '../../components/Form/LoginForm/LoginForm.tsx';
import { darkTheme, lightTheme } from '../../theme.ts';
import Messages from '../../components/Messages/Messages.tsx';
import Loading from '../../components/Loading/Loading.tsx';
import { useUpcomingAssignments } from '../../hooks/useUpcomingAssignments.ts';
import { Assignment } from '@server/types';
import AssignmentCard from '../../components/Card/AssignmentCard/AssignmentCard.tsx';
import SubjectCard from '../../components/Card/SubjectCard/SubjectCard.tsx';
import { AssignmentsSummary, DashboardHeading, SubjectsSummary } from './Dashboard.styled.ts';
import { Col, Row } from '../../components/common.styled.ts';

const Dashboard: FC = () => {
	const { clearMessages, currentSubjects, authenticated, theme, drawerOpen, setErrors } = useContext(AppContext);
	const themeObject = theme === 'light' ? lightTheme : darkTheme;
	const [showLogin, setShowLogin] = useState<boolean>(false);
	const upcomingWeeks = 2;
	const { results, loading } = useUpcomingAssignments({ weeks: upcomingWeeks });

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
			{ (showLogin && !drawerOpen) && <LoginForm />}
			{ loading && <Loading/> }

			{ !loading && currentSubjects &&
				<>
					<DashboardHeading>Current units</DashboardHeading>
					<SubjectsSummary>
						{currentSubjects.map(subject => <SubjectCard key={subject.projectId} subject={subject} />)}
					</SubjectsSummary>
				</>
			}

			{ !loading && results &&
				<>
					<DashboardHeading>Coming up <span>(next {upcomingWeeks} weeks)</span></DashboardHeading>
					<AssignmentsSummary>
						{results.map((assignment: Assignment) => {
							return <AssignmentCard key={assignment.id} assignment={assignment} showSubject={true}/>;
						})}
					</AssignmentsSummary>
				</>
			}
		</Page>
	);
};

export default Dashboard;
