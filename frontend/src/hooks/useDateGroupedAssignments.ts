import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ASSIGNMENTS_FOR_SUBJECT_QUERY } from '../graphql/queries.ts';
import groupBy from 'lodash/groupBy';
import { Assignment } from '@server/types.ts';
import difference from 'lodash/difference';

export function useDateGroupedAssignments(projectId: number, targetGrade: number) {
	const [assignmentGroups, setAssignmentGroups] = useState<any>();

	const { error, loading, data } = useQuery(ASSIGNMENTS_FOR_SUBJECT_QUERY,  {
		fetchPolicy: 'no-cache',
		variables: { projectId: projectId }
	});

	useEffect(() => {
		if(!loading && data) {
			const filtered = data.allAssignmentsForSubject.filter((item: Assignment) => item.target_grade <= targetGrade);
			const ordered = filtered.sort((a, b) => Date.parse(a.target_date) - Date.parse(b.target_date));
			const complete_or_submitted = ordered.filter((item: Assignment) => ['complete', 'ready_for_feedback'].includes(item.status));
			const incomplete = difference(ordered, complete_or_submitted);
			const grouped = {
				...groupBy(incomplete, 'target_date'),
				done: complete_or_submitted
			};

			const orderedGroups = Object.fromEntries(Object.entries(grouped).sort(([keyA, valuesA], [keyB, valuesB]) => {
				return Date.parse(keyA) - Date.parse(keyB);
			}));

			setAssignmentGroups(orderedGroups);
		}
	}, [data, loading, targetGrade]);

	return { assignmentGroups };
}
