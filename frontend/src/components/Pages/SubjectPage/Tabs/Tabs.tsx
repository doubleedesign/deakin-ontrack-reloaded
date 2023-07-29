import React, { FC, useContext, useEffect, useState } from 'react';
import { TabContentWrapper, TabNavButton, TabNavItem, TabNavList, TabPanels, TabSection } from './Tabs.styled.ts';
import { getColorForStatus, object_key_first, slugify, ucfirst } from '../../../../utils.ts';
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

	useEffect(() => {
		if(items) {
			setOpenTab(items ? object_key_first(items) : '');
		}
	}, [items]);

	useEffect(() => {
		fetch('http://localhost:5000/typecheck', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(Array.isArray(items) ? items[0] : items),
			redirect: 'manual'
		})
			.then(response => {
				return response.text();
			})
			.then(result => {
				console.log(result);
			})
			.catch(error => {
				console.log('error', error);
			});
	}, [items]);

	function getTabLabel(key: string) {
		if (viewMode === 'grade') {
			return targetGrades.find(grade => grade.value.toString() === key)?.label;
		}
		else if(viewMode === 'cluster') {
			return '// TODO';
		}
		else if(viewMode === 'date') {
			return key; // TODO: Nicely formatted dates
		}
		else {
			return ucfirst(key);
		}
	}

	/*
	return (
		<TabSection>
			<TabNavList>
				{viewMode === 'cluster' ?
					items?.map((cluster: AssignmentCluster) => {
						return (
							<TabNavItem key={slugify(cluster.label)}>
								<TabNavButton tabKey={slugify(cluster.label)}
								              color={getColorForStatus(cluster.label)}
								              aria-selected={openTab === slugify(cluster.label)}
								              onClick={() => setOpenTab(slugify(cluster.label))}>
									{cluster.label}
									<span>
										Ends {cluster.endDate.toLocaleDateString('en-AU', {
											day: 'numeric',
											weekday: 'long',
											month: 'long'
										})}
									</span>
								</TabNavButton>
							</TabNavItem>
						);
					})
					:
					items && Object.keys(items).map(key => {
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
	); */

	return <></>;
};

export default Tabs;
