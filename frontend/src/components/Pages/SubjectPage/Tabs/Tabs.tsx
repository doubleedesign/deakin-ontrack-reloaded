import React, { FC, useContext, useEffect, useState } from 'react';
import { TabContentWrapper, TabNavButton, TabNavItem, TabNavList, TabPanels, TabSection } from './Tabs.styled.ts';
import { getColorForStatus, object_key_first, ucfirst } from '../../../../utils.ts';
import { AppContext } from '../../../../context/AppContextProvider.tsx';
import IconForStatus from '../../../IconForStatus/IconForStatus.tsx';
import { targetGrades } from '../../../../constants.ts';
import { Row } from '../../../common.styled.ts';
import { Assignment, Subject } from '@server/types.ts';
import AssignmentCard from '../../../AssignmentCard/AssignmentCard.tsx';
import { AssignmentCluster, AssignmentGroup, SubjectViewMode } from '../../../../types.ts';

interface TabProps {
	items: AssignmentGroup | AssignmentCluster | undefined;
	viewMode: SubjectViewMode;
}

const Tabs: FC<TabProps> = ({ items, viewMode }) => {
	const { clearMessages } = useContext(AppContext);
	const [openTab, setOpenTab] = useState<string>('');

	useEffect(() => {
		clearMessages();
		setOpenTab(items ? object_key_first(items) : '');
	}, [clearMessages, items]);

	function getTabLabel(key: string) {
		if (viewMode === 'grade') {
			return targetGrades.find(grade => grade.value.toString() === key)?.label;
		}
		else if(viewMode === 'cluster') {
			return '// TODO';
		}
		else {
			return ucfirst(key);
		}
	}

	return (
		<TabSection>
			<TabNavList>
				{items && Object.keys(items).map(key => {
					return (
						<TabNavItem key={key}>
							<TabNavButton tabKey={key}
							              color={getColorForStatus(key)}
							              aria-selected={openTab === key}
							              onClick={() => setOpenTab(key)}>
								<IconForStatus status={key}/>
								{getTabLabel(key)}
							</TabNavButton>
						</TabNavItem>
					);
				})}
			</TabNavList>
			<TabPanels>
				{items && Object.entries(items).map(([status, assignments]) => {
					return (
						<TabContentWrapper key={status} tabKey={status} open={openTab === status}>
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
						</TabContentWrapper>
					);
				})}
			</TabPanels>
		</TabSection>
	);
};

export default Tabs;
