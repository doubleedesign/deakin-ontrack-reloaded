import React, { useEffect, useCallback, useState } from 'react';
import { Assignment, AssignmentCluster, AssignmentGroup } from '@server/types';
import { ContentDetail, ContentList, TabContentInner, TabContentWrapper, TabPanels } from './Tabs.styled.ts';
import { getColorForStatus, slugify } from '../../../utils.ts';
import { targetGrades } from '../../../constants.ts';
import AssignmentCard from '../../../components/Card/AssignmentCard/AssignmentCard.tsx';
import { SubjectViewMode } from '../../../types.ts';
import { CardButton } from '../../../components/Card/Card.styled.ts';
import AssignmentDetail from '../../../components/AssignmentDetail/AssignmentDetail.tsx';
import { add, isBefore, isSameDay, nextSunday } from 'date-fns';

export interface TabContentProps {
	items: AssignmentGroup | AssignmentCluster[];
	type: 'group' | 'cluster';
	viewMode: SubjectViewMode;
	openTab: string;
}

export const TabContent: React.FC<TabContentProps> = function({ items, type, viewMode, openTab }) {
	const [selected, setSelected] = useState<Assignment | undefined>(undefined);

	useEffect(() => {
		setSelected(undefined);
	}, [openTab]);

	const cardStatus = useCallback((assignment: Assignment) => {
		const today = new Date();
		const due = new Date(Date.parse(assignment.target_date));
		const sunday = nextSunday(today);

		if(['not_started', 'working_on_it', 'fix_and_resubmit', 'discuss'].includes(assignment.status)) {
			if (isBefore(due, today)) {
				return 'overdue';
			}
			else if (isSameDay(due, today)) {
				return 'today';
			}
			else if (isSameDay(due, add(today, { days: 1 }))) {
				return 'tomorrow';
			}
			else if (isBefore(due, sunday) || isSameDay(due, sunday)) {
				return 'upcoming';
			}
		}
		return assignment.status;
	}, []);

	return (
		<TabPanels>
			{(Array.isArray(items) && type === 'cluster') && (items as AssignmentCluster[]).map((item: AssignmentCluster) => {
				return (
					<TabContentWrapper key={slugify(item.label)}
					                   tabKey={slugify(item.label)}
					                   open={openTab === slugify(item.label)}
					>
						<TabContentInner>
							<ContentList>
								{item.assignments.map((assignment: Assignment) => {
									return (
										<CardButton key={assignment.id} onClick={() => setSelected(assignment)}
										            active={selected === assignment}
										            color={getColorForStatus(cardStatus(assignment))}>
											<AssignmentCard assignment={assignment}/>
										</CardButton>
									);
								})}
							</ContentList>
							<ContentDetail>
								{selected && <AssignmentDetail assignment={selected}/>}
							</ContentDetail>
						</TabContentInner>
					</TabContentWrapper>
				);
			})}
			{(!Array.isArray(items) && type === 'group') && Object.entries(items).map(([key, assignments]) => {
				if(assignments.length < 1) {
					return null;
				}
				return (
					<TabContentWrapper key={key}
					                   tabKey={viewMode === 'grade' ? slugify(targetGrades?.find(grade => {
						                   return grade?.value === parseInt((key));
					                   })?.label as string) : key}
					                   open={openTab === key}
					>
						<TabContentInner>
							<ContentList>
								{Array.isArray(assignments) && (assignments).map((assignment: Assignment) => {
									return (
										<CardButton key={assignment.id} onClick={() => setSelected(assignment)}
										            active={selected === assignment}
										            color={getColorForStatus(cardStatus(assignment))}>
											<AssignmentCard assignment={assignment}/>
										</CardButton>
									);
								})}
							</ContentList>
							<ContentDetail>
								{selected && <AssignmentDetail assignment={selected}/>}
							</ContentDetail>
						</TabContentInner>
					</TabContentWrapper>
				);
			})}
		</TabPanels>
	);
};

export default TabContent;
