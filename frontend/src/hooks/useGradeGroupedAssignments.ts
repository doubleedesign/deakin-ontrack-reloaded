import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ASSIGNMENTS_FOR_SUBJECT_QUERY } from '../graphql/queries.ts';
import groupBy from 'lodash/groupBy';
import { Assignment } from '@server/types';

export function useGradeGroupedAssignments(projectId: number, targetGrade: number, showComplete: boolean) {
	const [assignmentGroups, setAssignmentGroups] = useState<any>();

	const { error, loading, data } = useQuery(ASSIGNMENTS_FOR_SUBJECT_QUERY,  {
		fetchPolicy: 'no-cache',
		variables: { projectId: projectId }
	});


	useEffect(() => {
		if(!loading && data) {
			const filtered = data.allAssignmentsForSubject.filter((item: Assignment) => {
				if(!showComplete) {
					return item.target_grade <= targetGrade && item.status !== 'complete';
				}
				return item.target_grade <= targetGrade;
			});
			const ordered = filtered.sort((a, b) => Date.parse(a.target_date) - Date.parse(b.target_date));
			const grouped = groupBy(ordered, 'target_grade');

			setAssignmentGroups(grouped);
		}
	}, [data, loading, targetGrade, showComplete]);

	return { assignmentGroups, loading };
}
