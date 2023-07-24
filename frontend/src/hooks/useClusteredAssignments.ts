import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ASSIGNMENTS_FOR_SUBJECT_QUERY } from '../graphql/queries.ts';
import groupBy from 'lodash/groupBy';
import { Assignment } from '@server/types.ts';
import { intervalToDuration } from 'date-fns';

function clusterGroups(grouped) {
	//console.log(grouped);
}

export function useClusteredAssignments(projectId: number, targetGrade: number) {
	const [assignmentGroups, setAssignmentGroups] = useState<any>();

	const { error, loading, data } = useQuery(ASSIGNMENTS_FOR_SUBJECT_QUERY,  {
		fetchPolicy: 'no-cache',
		variables: { projectId: projectId }
	});

	useEffect(() => {
		if(!loading && data) {
			const filtered = data.allAssignmentsForSubject.filter((item: Assignment) => item.target_grade <= targetGrade);
			const ordered = filtered.sort((a, b) => Date.parse(a.target_date) - Date.parse(b.target_date));
			const grouped = groupBy(ordered, 'target_date');

			const orderedGroups = Object.fromEntries(Object.entries(grouped).sort(([keyA, valuesA], [keyB, valuesB]) => {
				return Date.parse(keyA) - Date.parse(keyB);
			}));

			clusterGroups(orderedGroups);

			setAssignmentGroups(orderedGroups); // TODO: Update to clustered groups
		}
	}, [data, loading, targetGrade]);

	return { assignmentGroups };
}
