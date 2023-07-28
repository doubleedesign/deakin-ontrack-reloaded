import { useState, useContext, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { ASSIGNMENTS_FOR_SUBJECT_QUERY } from '../../../../graphql/queries.ts';
import groupBy from 'lodash/groupBy';
import { Assignment, Subject } from '@server/types';
import { add, closestTo, eachWeekOfInterval, isSameDay, sub } from 'date-fns';
import { AppContext } from '../../../../context/AppContextProvider.tsx';
import { AssignmentCluster, AssignmentGroup } from '../../../../types.ts';


function clusterGroups(assignments: Assignment[], subject: Subject) {
	const desiredDueDates = [
		add(new Date(Date.parse(subject.startDate)), { weeks: 2, days: 6 }),
		add(new Date(Date.parse(subject.startDate)), { weeks: 4, days: 6 }),
		add(new Date(Date.parse(subject.startDate)), { weeks: 7, days: 6 }),
		add(new Date(Date.parse(subject.startDate)), { weeks: 9, days: 6 }),
		sub(new Date(Date.parse(subject.endDate)), { weeks: 2 })
	];

	const weeks = eachWeekOfInterval({
		start: Date.parse(subject.startDate),
		end: new Date(Date.parse(subject.endDate))
	});

	weeks.splice(5, 1); // Deletes the intra-trimester break, so may need to be changed on a per-trimester basis

	const clusteredAssignments: AssignmentCluster[] = desiredDueDates.map((date: Date, index: number) => {
		const sunday = closestTo(date, weeks);
		const week = weeks.findIndex(lastDayOfWeek => isSameDay(lastDayOfWeek, sunday as Date));
		return {
			label: `Week ${week}`,
			endDate: date,
			assignments: []
		};
	});

	assignments.forEach((item: Assignment) => {
		const closestClusterDate = closestTo(new Date(Date.parse(item.target_date)), desiredDueDates);
		const cluster = clusteredAssignments.find(cluster => isSameDay(cluster.endDate, closestClusterDate as Date));
		cluster?.assignments.push(item);
	});

	return clusteredAssignments;
}

export function useClusteredAssignments(subject: Subject, targetGrade: number) {
	const [getAssignments] = useLazyQuery(ASSIGNMENTS_FOR_SUBJECT_QUERY);
	const [isLoading, setLoading] = useState<boolean>(true);
	const [allAssignments, setAllAssignments] = useState<Assignment[]>();
	const [assignmentGroups, setAssignmentGroups] = useState<AssignmentCluster[] | AssignmentGroup>();
	const { setWarningMessages } = useContext(AppContext);

	useEffect(() => {
		if(subject?.projectId) {
			getAssignments({
				fetchPolicy: 'no-cache',
				variables: { projectId: subject?.projectId }
			}).then((response => {
				setLoading(response.loading);
				setAllAssignments(response?.data?.allAssignmentsForSubject);
			}));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [subject]);

	useEffect(() => {
		if (allAssignments) {
			const filtered: Assignment[] = allAssignments.filter((item: Assignment) => item.target_grade <= targetGrade);
			const ordered: Assignment[] = filtered.sort((a, b) => Date.parse(a.target_date) - Date.parse(b.target_date));
			const grouped = groupBy(ordered, 'target_date');
			const done = ordered.filter(item => ['complete', 'submitted', 'discuss'].includes(item.status));

			const dateGroups = Object.fromEntries(Object.entries(grouped).sort(([keyA, valuesA], [keyB, valuesB]) => {
				return Date.parse(keyA) - Date.parse(keyB);
			}));

			if (!subject.startDate || Object.keys(dateGroups).length < 5) {
				setAssignmentGroups(dateGroups);
			}
			else {
				setWarningMessages([[
					`You have ${filtered.length - done.length} tasks remaining for your target grade, 
					with ${Object.keys(grouped).length - 1} different due dates.`,
					'This page shows suggested clustering of tasks. You may need to request extensions on some tasks for these to work in practice.'
				]]);

				setAssignmentGroups(clusterGroups(filtered, subject));
			}
		}
	}, [allAssignments, setWarningMessages, subject, targetGrade]);


	return { assignmentGroups };
}
