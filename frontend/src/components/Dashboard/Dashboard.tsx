import React, { FC, useContext } from 'react';
import { DashboardWrapper } from './Dashboard.styled';
import SubjectSummary from '../SubjectSummary/SubjectSummary.tsx';
import { AppContext } from '../../context/AppContextProvider.tsx';

const Dashboard: FC = () => {
	const { currentSubjects } = useContext(AppContext);
	return (
		<DashboardWrapper>
			{currentSubjects && currentSubjects.map(subject => {
				return <SubjectSummary key={subject.projectId} subject={subject}/>;
			})}
		</DashboardWrapper>
	);
};

export default Dashboard;
