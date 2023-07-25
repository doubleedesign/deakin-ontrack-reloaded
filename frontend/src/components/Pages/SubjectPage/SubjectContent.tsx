import React, { FC, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContextProvider.tsx';
import { useStatusGroupedAssignments } from './sorting/useStatusGroupedAssignments.ts';
import { useDateGroupedAssignments } from './sorting/useDateGroupedAssignments.ts';
import { useGradeGroupedAssignments } from './sorting/useGradeGroupedAssignments.ts';
import Tabs from './Tabs/Tabs.tsx';
import { AssignmentGroup, SubjectViewMode } from '../../../types.ts';
import ClusteredAssignments from './ClusteredAssignments/ClusteredAssignments.tsx';
import { Subject } from '@server/types.ts';

interface SubjectContentProps {
	projectId: number;
	viewMode: SubjectViewMode;
	targetGrade: number;
	subject: Subject;
}

const SubjectContent: FC<PropsWithChildren<SubjectContentProps>> = ({ projectId, viewMode, subject, targetGrade, children }) => {
	const { clearMessages } = useContext(AppContext);
	const { assignmentGroups: byStatus } = useStatusGroupedAssignments(projectId, targetGrade);
	const { assignmentGroups: byDate } = useDateGroupedAssignments(projectId, targetGrade);
	const { assignmentGroups: byGrade } = useGradeGroupedAssignments(projectId, targetGrade);
	const [currentGroups, setCurrentGroups] = useState<AssignmentGroup>();

	useEffect(() => {
		clearMessages();
		if(viewMode === 'status') {
			console.log(byStatus);
			setCurrentGroups(byStatus);
		}
		if(viewMode === 'date') {
			setCurrentGroups(byDate);
		}
		if(viewMode === 'grade') {
			setCurrentGroups(byGrade);
		}
	}, [viewMode]);

	return (
		<>
			{viewMode === 'cluster' ?
				<ClusteredAssignments subject={subject} targetGrade={targetGrade}/>
				: <Tabs items={currentGroups} viewMode={viewMode} />}
		</>
	);
};

export default SubjectContent;
