import React, { FC, useContext, useState, useEffect, useMemo } from 'react';
import { AppContext } from '../../context/AppContextProvider.tsx';
import Page from '../Page.tsx';
import LoginForm from '../../components/Form/LoginForm/LoginForm.tsx';
import { darkTheme, lightTheme } from '../../theme.ts';
import Messages from '../../components/Messages/Messages.tsx';
import Loading from '../../components/Loading/Loading.tsx';
import { useUpcomingAssignments } from '../../hooks/useUpcomingAssignments.ts';
import { Assignment } from '@server/types';
import SubjectCard from '../../components/Card/SubjectCard/SubjectCard.tsx';
import { DashboardHeading, SubjectsSummary, SubjectSummarySection } from './Dashboard.styled.ts';
import { add, isBefore, isSameDay } from 'date-fns';
import AssignmentsSummary from './AssignmentsSummary/AssignmentsSummary.tsx';

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

	const overdue: Assignment[] = useMemo(() => {
		const today = new Date();
		return results?.filter(item => {
			const due = new Date(Date.parse(item.target_date));
			return isBefore(due, today) && !isSameDay(due, today);
		}) || [];
	}, [results]);

	const dueNow: Assignment[] = useMemo(() => {
		const today = new Date();
		const tomorrow = add(today, { days: 1 });
		return results?.filter(item => {
			const due = new Date(Date.parse(item.target_date));
			return isSameDay(due, today) || isSameDay(due, tomorrow);
		}) || [];
	}, [results]);

	const remaining: Assignment[] = useMemo(() => {
		return results?.filter(item => {
			return !overdue?.includes(item) && !dueNow?.includes(item);
		}) || [];
	}, [results, overdue, dueNow]);

	return (
		<Page color={themeObject.colors.logo}>
			<Messages/>
			{ (showLogin && !drawerOpen) && <LoginForm />}
			{ loading && <Loading/> }

			{ !loading && currentSubjects &&
				<SubjectSummarySection>
					<DashboardHeading>Current units</DashboardHeading>
					<SubjectsSummary>
						{currentSubjects.map(subject => <SubjectCard key={subject.projectId} subject={subject} />)}
					</SubjectsSummary>
				</SubjectSummarySection>
			}

			{ !loading && results &&
				<div>
					{overdue && <AssignmentsSummary status="overdue" items={overdue}/> }
					{dueNow && <AssignmentsSummary status="tomorrow" items={dueNow}/> }
					<AssignmentsSummary status="later" items={remaining} />
				</div>
			}

		</Page>
	);
};

export default Dashboard;
