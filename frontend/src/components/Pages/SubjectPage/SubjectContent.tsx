import React, { FC, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContextProvider.tsx';
import { useStatusGroupedAssignments } from './sorting/useStatusGroupedAssignments.ts';
import { useDateGroupedAssignments } from './sorting/useDateGroupedAssignments.ts';
import { useGradeGroupedAssignments } from './sorting/useGradeGroupedAssignments.ts';
import Tabs from './Tabs/Tabs.tsx';
import { SubjectViewMode } from '../../../types.ts';
import { AssignmentCluster, AssignmentGroup, Subject } from '@server/types';
import { useClusteredAssignments } from './sorting/useClusteredAssignments.ts';

interface SubjectContentProps {
	projectId: number;
	viewMode: SubjectViewMode;
	targetGrade: number;
	subject: Subject;
}

const SubjectContent: FC<PropsWithChildren<SubjectContentProps>> = ({ projectId, viewMode, subject, targetGrade, children }) => {
	const { clearMessages } = useContext(AppContext);
	const { assignmentGroups: byCluster } = useClusteredAssignments(subject, targetGrade);
	const { assignmentGroups: byStatus } = useStatusGroupedAssignments(projectId, targetGrade);
	const { assignmentGroups: byDate } = useDateGroupedAssignments(projectId, targetGrade);
	const { assignmentGroups: byGrade } = useGradeGroupedAssignments(projectId, targetGrade);
	const [currentGroups, setCurrentGroups] = useState<AssignmentGroup | AssignmentCluster[]>();

	useEffect(() => {
		clearMessages();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if(viewMode === 'cluster') {
			setCurrentGroups(byCluster);
		}
		if(viewMode === 'status') {
			setCurrentGroups(byStatus);
		}
		if(viewMode === 'date') {
			setCurrentGroups(byDate);
		}
		if(viewMode === 'grade') {
			setCurrentGroups(byGrade);
		}
	}, [byCluster, byDate, byGrade, byStatus, viewMode]);


	return <Tabs items={currentGroups} viewMode={viewMode} />;
};

export default SubjectContent;
