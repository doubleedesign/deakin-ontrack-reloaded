import React, { FC, useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContextProvider.tsx';
import { Col, Row } from '../../components/common.styled.ts';
import Page from '../Page.tsx';
import LoginForm from '../../components/Form/LoginForm/LoginForm.tsx';
import { darkTheme, lightTheme } from '../../theme.ts';
import Messages from '../../components/Messages/Messages.tsx';
import Loading from '../../components/Loading/Loading.tsx';
import { ApolloError, useQuery } from '@apollo/client';
import { ASSIGNMENTS_FOR_SUBJECT_QUERY, UPCOMING_ASSIGNMENTS_QUERY } from '../../graphql/queries.ts';
import { GraphQLError } from 'graphql/error';
import { useUpcomingAssignments } from '../../hooks/useUpcomingAssignments.ts';
import { Assignment } from '@server/types';
import AssignmentCard from '../../components/Card/AssignmentCard/AssignmentCard.tsx';
import SubjectCard from '../../components/Card/SubjectCard/SubjectCard.tsx';

const Dashboard: FC = () => {
	const { clearMessages, currentSubjects, authenticated, theme, drawerOpen, setErrors } = useContext(AppContext);
	const themeObject = theme === 'light' ? lightTheme : darkTheme;
	const [showLogin, setShowLogin] = useState<boolean>(false);
	const { results, loading } = useUpcomingAssignments({ weeks: 2 });

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
			{ !loading && results &&
				<>
					<Row>
						<Col>
							<h2>Due in the next 2 weeks</h2>
						</Col>
					</Row>
					<Row>
						{results.map((assignment: Assignment) => {
							return <AssignmentCard key={assignment.id} assignment={assignment}/>;
						})}
					</Row>
				</>
			}
		</Page>
	);
};

export default Dashboard;
