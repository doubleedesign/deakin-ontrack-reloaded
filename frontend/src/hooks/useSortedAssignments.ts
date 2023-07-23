import { useState, useEffect } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import { ASSIGNMENTS_FOR_SUBJECT_QUERY } from '../graphql/queries.ts';
import groupBy from 'lodash/groupBy';

export function useSortedAssignments(projectId: number) {
	const [assignmentGroups, setAssignmentGroups] = useState<any>();

	const { error, loading, data } = useQuery(ASSIGNMENTS_FOR_SUBJECT_QUERY,  {
		fetchPolicy: 'no-cache',
		variables: { projectId: projectId }
	});

	useEffect(() => {
		if(!loading && data) {
			const ordered = data.allAssignmentsForSubject.sort((a, b) => Date.parse(a.due_date) - Date.parse(b.due_date));
			const grouped = groupBy(ordered, 'status');
			// eslint-disable-next-line max-len
			const sortOrder = ['discuss', 'fix_and_resubmit', 'working_on_it', 'not_started', 'need_help', 'time_exceeded', 'complete', 'feedback_exceeded'];

			const orderedGroups = Object.entries(grouped).sort(([keyA, valuesA], [keyB, valuesB]) => {
				if (!sortOrder.includes(keyA)) return 1;
				if (!sortOrder.includes(keyB)) return -1;
				return sortOrder.indexOf(keyA) - sortOrder.indexOf(keyB);
			});

			setAssignmentGroups(Object.fromEntries(orderedGroups));
		}
	}, [data, loading]);

	return { assignmentGroups };
}
