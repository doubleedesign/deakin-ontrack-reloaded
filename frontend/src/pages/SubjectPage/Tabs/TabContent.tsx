import React from 'react';
import { Assignment, AssignmentCluster, AssignmentGroup } from '@server/types';
import { TabContentWrapper, TabPanels } from './Tabs.styled.ts';
import { slugify } from '../../../utils.ts';
import { targetGrades } from '../../../constants.ts';
import { Row } from '../../../components/common.styled.ts';
import AssignmentCard from '../../../components/Card/AssignmentCard/AssignmentCard.tsx';
import { SubjectViewMode } from '../../../types.ts';

export interface TabContentProps {
	items: AssignmentGroup | AssignmentCluster[];
	type: 'group' | 'cluster';
	viewMode: SubjectViewMode;
	openTab: string;
}

export const TabContent: React.FC<TabContentProps> = function({ items, type, viewMode, openTab }) {

	return (
		<TabPanels>
			{(Array.isArray(items) && type === 'cluster') && (items as AssignmentCluster[]).map((item: AssignmentCluster) => {
				return (
					<TabContentWrapper key={slugify(item.label)}
					                   tabKey={slugify(item.label)}
					                   open={openTab === slugify(item.label)}
					>
						<Row>
							{item.assignments.map((assignment: Assignment) => {
								return (
									<AssignmentCard assignment={assignment} />
								);
							})}
						</Row>
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
						<Row>
							{Array.isArray(assignments) && (assignments).map((assignment: Assignment) => {
								return (
									<AssignmentCard assignment={assignment}/>
								);
							})}
						</Row>
					</TabContentWrapper>
				);
			})}
		</TabPanels>
	);
};

export default TabContent;
