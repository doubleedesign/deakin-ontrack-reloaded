import React, { FC, useContext, useEffect, useState } from 'react';
import { TabContentWrapper, TabNavButton, TabNavItem, TabNavList, TabNavWrapper, TabPanels, TabSection } from './Tabs.styled.ts';
import { getColorForStatus, getTypes, object_key_first, slugify, ucfirst } from '../../../../utils.ts';
import { AppContext } from '../../../../context/AppContextProvider.tsx';
import IconForStatus from '../../../IconForStatus/IconForStatus.tsx';
import { targetGrades } from '../../../../constants.ts';
import { Row } from '../../../common.styled.ts';
import { Assignment, AssignmentCluster, AssignmentGroup, Subject } from '@server/types';
import AssignmentCard from '../../../AssignmentCard/AssignmentCard.tsx';
import { SubjectViewMode } from '../../../../types.ts';

interface TabProps {
	items: AssignmentGroup | AssignmentCluster[] | undefined;
	viewMode: SubjectViewMode;
}

const Tabs: FC<TabProps> = ({ items, viewMode }) => {
	const [openTab, setOpenTab] = useState<string>('');
	const [type, setType] = useState<'cluster'|'group'>('group');

	useEffect(() => {
		getTypes(Array.isArray(items) ? items[0] : items).then(result => {
			if(result && result.includes('AssignmentCluster')) {
				setType('cluster');
			}
			else {
				setType('group');
			}
		});
	}, [items]);

	useEffect(() => {
		if(items) {
			if(type === 'cluster') {
				// @ts-ignore
				setOpenTab(slugify(items[0].label));
			}
			else {
				setOpenTab(object_key_first(items));
			}
		}
	}, [items, type]);

	function getTabLabel(key: string) {
		if (viewMode === 'grade') {
			return targetGrades.find(grade => grade.value.toString() === key)?.label;
		}
		else if(viewMode === 'date') {
			return key; // TODO: Nicely formatted dates
		}
		else {
			return ucfirst(key);
		}
	}

	return (
		<TabSection>
			<TabNavWrapper>
				<TabNavList>
					{(items && type === 'cluster') && (items as AssignmentCluster[]).map((item: AssignmentCluster) => {
						return (
							<TabNavItem key={slugify(item.label)}>
								<TabNavButton tabKey={slugify(item.label)}
							              color={openTab == slugify(item.label) ? 'logo' : 'light'}
							              aria-selected={openTab === slugify(item.label)}
							              onClick={() => setOpenTab(slugify(item.label))}
								>
									{item.label}
									<span>Ends {item.endDate.toLocaleDateString('en-AU', {
										day: 'numeric',
										weekday: 'long',
										month: 'long'
									})}</span>
								</TabNavButton>
							</TabNavItem>
						);
					})}
					{(items && type === 'group') && Object.keys(items).map(key => {
						return (
							<TabNavItem key={key}>
								<TabNavButton tabKey={key}
						                  color={openTab == key ? getColorForStatus(key) : 'light'}
							              aria-selected={openTab === key}
							              onClick={() => setOpenTab(key)}>
									<IconForStatus status={key}/>
									{getTabLabel(key)}
								</TabNavButton>
							</TabNavItem>
						);
					})}
				</TabNavList>
			</TabNavWrapper>
			<TabPanels>
				{(items && type === 'cluster') && (items as AssignmentCluster[]).map((item: AssignmentCluster) => {
					return (
						<TabContentWrapper key={slugify(item.label)}>

						</TabContentWrapper>
					);
				})}
				{(items && type === 'group') && Object.entries(items).map(([key, assignments]) => {
					return (
						<TabContentWrapper key={key} tabKey={key} open={openTab === key}>
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
