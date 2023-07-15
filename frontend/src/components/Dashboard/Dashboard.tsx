import React, { FC, useContext } from 'react';
import SubjectSummary from '../SubjectSummary/SubjectSummary.tsx';
import { AppContext } from '../../context/AppContextProvider.tsx';
import { Panel, Row } from '../common.styled.ts';

const Dashboard: FC = () => {
	const { currentSubjects } = useContext(AppContext);
	return (
		<Panel>
			<Row>
				{currentSubjects && currentSubjects.map(subject => {
					return <SubjectSummary key={subject.projectId} subject={subject}/>;
				})}
			</Row>
		</Panel>
	);
};

export default Dashboard;
