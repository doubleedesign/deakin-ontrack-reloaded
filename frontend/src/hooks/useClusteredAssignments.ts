import { useState, useContext, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { ASSIGNMENTS_FOR_SUBJECT_QUERY } from '../graphql/queries.ts';
import groupBy from 'lodash/groupBy';
import difference from 'lodash/difference';
import { Assignment } from '@server/types.ts';
import { intervalToDuration } from 'date-fns';
import { AppContext } from '../context/AppContextProvider.tsx';


export function useClusteredAssignments(projectId: number, targetGrade: number) {
	const { setWarningMessages } = useContext(AppContext);
	const [assignmentGroups, setAssignmentGroups] = useState<any>();

	const { error, loading, data } = useQuery(ASSIGNMENTS_FOR_SUBJECT_QUERY,  {
		fetchPolicy: 'no-cache',
		variables: { projectId: projectId }
	});

	const clusterGroups = useCallback((grouped: any) => {
		if(data?.allAssignmentsForSubject && grouped) {
			const clusterMessages = [];
			let result;
			console.log(grouped);
			const dates = Object.keys(grouped);
			if (dates.length < 7) {
				setWarningMessages([]);
				return grouped;
			}

			clusterMessages.push([
				`You have ${data.allAssignmentsForSubject.length - grouped.done.length} tasks remaining for your target grade, with ${Object.keys(grouped).length - 1} individual due dates.`,
				'This page shows suggested clustering of tasks. You may need to request extensions on some tasks for these to work in practice.'
			]);

			setWarningMessages(clusterMessages);
			return result;
		}
	}, [data, setWarningMessages]);


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

			clusterGroups(orderedGroups);

			setAssignmentGroups(orderedGroups); // TODO: Update to clustered groups
		}
	}, [data, loading, targetGrade]);

	return { assignmentGroups };
}
