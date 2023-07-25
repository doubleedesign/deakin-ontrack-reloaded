import React, { FC, useContext, useEffect, useState } from 'react';
import { TabContent, TabNav, TabNavButton, TabNavItem, TabNavList, TabPanels, TabSection } from '../../../Tabs/Tabs.styled.ts';
import { getColorForStatus, object_key_first, ucfirst } from '../../../../utils.ts';
import IconForStatus from '../../../IconForStatus/IconForStatus.tsx';
import { Row } from '../../../common.styled.ts';
import { Assignment } from '@server/types.ts';
import AssignmentCard from '../../../AssignmentCard/AssignmentCard.tsx';
import { AppContext } from '../../../../context/AppContextProvider.tsx';
import { useGradeGroupedAssignments } from '../../../../hooks/useGradeGroupedAssignments.ts';
import { targetGrades } from '../../../../constants.ts';

interface StatusGroupedAssignmentsProps {
	projectId: number;
	targetGrade: number; // local to this app, doesn't alter actual OnTrack setting/results
}

const GradeGroupedAssignments: FC<StatusGroupedAssignmentsProps> = ({ projectId, targetGrade }) => {
	const { clearMessages } = useContext(AppContext);
	const { assignmentGroups } = useGradeGroupedAssignments(projectId, targetGrade);
	const [openTab, setOpenTab] = useState<string>('');

	useEffect(() => {
		clearMessages();
		if(assignmentGroups) {
			// @ts-ignore
			setOpenTab(object_key_first(assignmentGroups));
		}
	}, [assignmentGroups]);

	return (
		<TabSection id="assignmentTabs">
			<TabNav>
				<TabNavList>
					{assignmentGroups && Object.keys(assignmentGroups).map(key => {
						return (
							<TabNavItem key={key}>
								<TabNavButton tabKey={key}
									              color={getColorForStatus(key)}
									              aria-selected={openTab === key}
									              onClick={() => setOpenTab(key)}>
									<IconForStatus status={key}/>
									{targetGrades?.find((grade: {value: number; label: string}) => grade.value.toString() === key)?.label}
								</TabNavButton>
							</TabNavItem>
						);
					})}
				</TabNavList>
			</TabNav>
			<TabPanels>
				{assignmentGroups && Object.entries(assignmentGroups).map(([status, assignments]) => {
					return (
						<TabContent key={status} tabKey={status} open={openTab === status}>
							<Row>
								{(assignments as Assignment[]).map((assignment: Assignment) => {
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
						</TabContent>
					);
				})}
			</TabPanels>
		</TabSection>
	);
};

export default GradeGroupedAssignments;
