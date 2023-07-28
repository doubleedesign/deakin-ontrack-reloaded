import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ASSIGNMENTS_FOR_SUBJECT_QUERY } from '../../../../graphql/queries.ts';
import groupBy from 'lodash/groupBy';
import { Assignment } from '@server/types';

export function useGradeGroupedAssignments(projectId: number, targetGrade: number) {
	const [assignmentGroups, setAssignmentGroups] = useState<any>();

	const { error, loading, data } = useQuery(ASSIGNMENTS_FOR_SUBJECT_QUERY,  {
		fetchPolicy: 'no-cache',
		variables: { projectId: projectId }
	});

	useEffect(() => {
		if(!loading && data) {
			const filtered = data.allAssignmentsForSubject.filter((item: Assignment) => item.target_grade <= targetGrade);
			const ordered = filtered.sort((a, b) => Date.parse(a.target_date) - Date.parse(b.target_date));
			const grouped = groupBy(ordered, 'target_grade');
			// eslint-disable-next-line max-len
			//const sortOrder = ['discuss', 'fix_and_resubmit', 'working_on_it', 'not_started', 'ready_for_feedback', 'need_help', 'time_exceeded', 'complete', 'feedback_exceeded'];

			/*
			const orderedGroups = Object.entries(grouped).sort(([keyA, valuesA], [keyB, valuesB]) => {
				if (!sortOrder.includes(keyA)) return 1;
				if (!sortOrder.includes(keyB)) return -1;
				return sortOrder.indexOf(keyA) - sortOrder.indexOf(keyB);
			}); */

			//setAssignmentGroups(Object.fromEntries(orderedGroups));
			setAssignmentGroups(grouped);
		}
	}, [data, loading, targetGrade]);

	return { assignmentGroups };
}
