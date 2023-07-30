import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ASSIGNMENTS_FOR_SUBJECT_QUERY } from '../../../../graphql/queries.ts';
import groupBy from 'lodash/groupBy';
import { Assignment } from '@server/types';
import difference from 'lodash/difference';
import { add, isBefore, isSameDay, nextSunday } from 'date-fns';

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
			const complete_or_submitted = ordered.filter((item: Assignment) => {
				return ['complete', 'ready_for_feedback'].includes(item.status);
			});
			const overdue = filtered.filter(item => {
				const today = new Date();
				const due = new Date(Date.parse(item.target_date));
				return isBefore(due, today) && !complete_or_submitted.includes(item);
			});
			const dueToday = filtered.filter(item => {
				const today = new Date();
				const due = new Date(Date.parse(item.target_date));
				return isSameDay(due, today) && !complete_or_submitted.includes(item);
			});
			const dueTomorrow = filtered.filter(item => {
				const today = new Date();
				const due = new Date(Date.parse(item.target_date));
				return isSameDay(due, add(today, { days: 1 })) && !complete_or_submitted.includes(item);
			});
			const dueThisWeek = filtered.filter(item => {
				const today = new Date();
				const due = new Date(Date.parse(item.target_date));
				const sunday = nextSunday(today);
				return (isBefore(due, sunday) || isSameDay(due, sunday)) && !dueToday.concat(dueTomorrow).includes(item);
			});
			const incomplete = difference(ordered, dueToday.concat(dueTomorrow).concat(overdue).concat(complete_or_submitted));
			const grouped = {
				overdue: overdue,
				today: dueToday,
				tomorrow: dueTomorrow,
				this_week: dueThisWeek,
				...groupBy(incomplete, 'target_date'),
				done: complete_or_submitted
			};

			const orderedGroups = Object.fromEntries(Object.entries(grouped).sort(([keyA, valuesA], [keyB, valuesB]) => {
				return Date.parse(keyA) - Date.parse(keyB);
			}));

			setAssignmentGroups(orderedGroups);
		}
	}, [data, loading, targetGrade]);

	return { assignmentGroups, loading };
}
