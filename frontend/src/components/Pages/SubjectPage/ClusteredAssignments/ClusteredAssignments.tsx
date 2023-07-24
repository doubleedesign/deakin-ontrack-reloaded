import React, { FC, useEffect, useState } from 'react';
import { TabContent, TabNav, TabNavButton, TabNavItem, TabNavList, TabPanels, TabSection } from '../../../Tabs/Tabs.styled.ts';
import { getColorForStatus, object_key_first, ucfirst } from '../../../../utils.ts';
import IconForStatus from '../../../IconForStatus/IconForStatus.tsx';
import { Row } from '../../../common.styled.ts';
import { Assignment } from '@server/types.ts';
import Card from '../../../Card/Card.tsx';
import { useClusteredAssignments } from '../../../../hooks/useClusteredAssignments.ts';

interface ClusteredAssignmentsProps {
	projectId: number;
	targetGrade: number;
}

const ClusteredAssignments: FC<ClusteredAssignmentsProps> = ({ projectId, targetGrade }) => {
	const { assignmentGroups } = useClusteredAssignments(projectId, targetGrade);
	const [openTab, setOpenTab] = useState<string>('');

	useEffect(() => {
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
									{key}
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
										<Card key={assignment.id}
											      title={`${assignment.abbreviation} ${assignment.name}`}
											      status={assignment.status}
											      dueDate={assignment.target_date}
										>
											<p>{assignment.description}</p>
										</Card>
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

export default ClusteredAssignments;
