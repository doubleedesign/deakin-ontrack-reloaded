import React, { FC, useEffect, useState } from 'react';
import { TabNavButton, TabNavItem, TabNavList, TabPanels, TabSection, TabNavWrapper, TabContentWrapper } from '../Tabs/Tabs.styled.ts';
import { getColorForStatus, slugify } from '../../../../utils.ts';
import { Row } from '../../../common.styled.ts';
import { Assignment, Subject } from '@server/types.ts';
import AssignmentCard from '../../../AssignmentCard/AssignmentCard.tsx';
import { useClusteredAssignments } from '../sorting/useClusteredAssignments.ts';
import { AssignmentCluster } from '../../../../types.ts';
import { closestTo, isSameDay } from 'date-fns';

interface ClusteredAssignmentsProps {
	subject: Subject;
	targetGrade: number; // local to this app, doesn't alter actual OnTrack setting/results
}

const ClusteredAssignments: FC<ClusteredAssignmentsProps> = ({ subject, targetGrade }) => {
	const { assignmentGroups } = useClusteredAssignments(subject, targetGrade);
	const [openTab, setOpenTab] = useState<string>();

	useEffect(() => {
		if(assignmentGroups && assignmentGroups[0].label) {
			const today = new Date();
			const closestDate = closestTo(today, assignmentGroups.map((group: AssignmentCluster) => group.endDate));
			const closestWeek = assignmentGroups.find((group: AssignmentCluster) => isSameDay(group.endDate, closestDate as Date));
			setOpenTab(slugify(closestWeek.label) || '');
		}
	}, [assignmentGroups]);

	return (
		<TabSection id="assignmentTabs">
			<TabNavWrapper>
				<TabNavList>
					{assignmentGroups && assignmentGroups.map((group: AssignmentCluster) => {
						return (
							<TabNavItem key={slugify(group.label)}>
								<TabNavButton tabKey={slugify(group.label)}
									              color={getColorForStatus(group.label)}
									              aria-selected={openTab === slugify(group.label)}
									              onClick={() => setOpenTab(slugify(group.label))}>
									{group.label}
									<span>
										Ends {group.endDate.toLocaleDateString('en-AU', {
											day: 'numeric',
											weekday: 'long',
											month: 'long'
										})}
									</span>
								</TabNavButton>
							</TabNavItem>
						);
					})}
				</TabNavList>
			</TabNavWrapper>
			<TabPanels>
				{assignmentGroups && assignmentGroups.map((group: AssignmentCluster) => {
					return (
						<TabContentWrapper key={slugify(group.label)} tabKey={slugify(group.label)} open={openTab === slugify(group.label)}>
							<Row>
								{(group.assignments as Assignment[]).map((assignment: Assignment) => {
									return (
										<AssignmentCard key={assignment.id}
										                title={`${assignment.abbreviation} ${assignment.name}`}
										                status={assignment.status}
										                dueDate={assignment.target_date}
										>
											<p>{assignment.description}</p>
										</AssignmentCard>
									);
								})}
							</Row>
						</TabContentWrapper>
					);
				})}
			</TabPanels>
		</TabSection>
	);
};

export default ClusteredAssignments;
