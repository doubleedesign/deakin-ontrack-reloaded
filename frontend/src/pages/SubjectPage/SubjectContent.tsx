import React, { FC, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContextProvider.tsx';
import { useStatusGroupedAssignments } from '../../hooks/useStatusGroupedAssignments.ts';
import { useDateGroupedAssignments } from '../../hooks/useDateGroupedAssignments.ts';
import { useGradeGroupedAssignments } from '../../hooks/useGradeGroupedAssignments.ts';
import Tabs from './Tabs/Tabs.tsx';
import { SubjectViewMode } from '../../types.ts';
import { AssignmentCluster, AssignmentGroup, Subject } from '@server/types';
import { useClusteredAssignments } from '../../hooks/useClusteredAssignments.ts';
import Loading from '../../components/Loading/Loading.tsx';

interface SubjectContentProps {
	projectId: number;
	viewMode: SubjectViewMode;
	targetGrade: number;
	subject: Subject;
	showComplete: boolean; // only used when displaying by target grade
}

const SubjectContent: FC<PropsWithChildren<SubjectContentProps>> = ({ projectId, viewMode, subject, targetGrade, showComplete }) => {
	const { clearMessages } = useContext(AppContext);
	const { assignmentGroups: byCluster, loading: clusterLoading } = useClusteredAssignments(subject, targetGrade);
	const { assignmentGroups: byStatus, loading: statusLoading } = useStatusGroupedAssignments(projectId, targetGrade);
	const { assignmentGroups: byDate, loading: dateLoading } = useDateGroupedAssignments(projectId, targetGrade);
	const { assignmentGroups: byGrade, loading: gradeLoading } = useGradeGroupedAssignments(projectId, targetGrade, showComplete);
	const [loading, setLoading] = useState<boolean>(false);
	const [currentGroups, setCurrentGroups] = useState<AssignmentGroup | AssignmentCluster[]>();

	useEffect(() => {
		setLoading(true);
	}, []);

	useEffect(() => {
		clearMessages();
		if(viewMode === 'cluster' && byCluster) {
			setCurrentGroups(byCluster);
			setLoading(false);
		}
		if(viewMode === 'status' && byStatus) {
			setCurrentGroups(byStatus);
			setLoading(false);
		}
		if(viewMode === 'date' && byDate) {
			setCurrentGroups(byDate);
			setLoading(false);
		}
		if(viewMode === 'grade' && byGrade) {
			setCurrentGroups(byGrade);
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [byCluster, byDate, byGrade, byStatus, viewMode]);

	useEffect(() => {
		if(clusterLoading || statusLoading || dateLoading || gradeLoading) {
			setLoading(true);
		}
	}, [clusterLoading, statusLoading, dateLoading, gradeLoading]);


	return (
		<>
			{loading ? <Loading/> : <Tabs items={currentGroups} viewMode={viewMode} />}
		</>
	);
};

export default SubjectContent;
