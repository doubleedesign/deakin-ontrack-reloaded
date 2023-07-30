import React, { Dispatch, SetStateAction } from 'react';
import { TabNavButton, TabNavItem, TabNavList, TabNavWrapper } from './Tabs.styled.ts';
import { AssignmentCluster, AssignmentGroup } from '@server/types';
import { getColorForStatus, slugify, ucfirst } from '../../../../utils.ts';
import { targetGrades } from '../../../../constants.ts';
import IconForStatus from '../../../IconForStatus/IconForStatus.tsx';
import { SubjectViewMode } from '../../../../types.ts';
import { isValid } from 'date-fns';

export interface TabNavProps {
	items: AssignmentGroup | AssignmentCluster[];
	type: 'group' | 'cluster';
	viewMode: SubjectViewMode;
	openTab: string;
	setOpenTab: Dispatch<SetStateAction<string>>;
}

export const TabNav: React.FC<TabNavProps> = function({ items, type, viewMode, openTab, setOpenTab }) {

	function getTabLabel(key: string) {
		if (viewMode === 'grade') {
			return targetGrades.find(grade => grade.value.toString() === key)?.label;
		}
		else if(viewMode === 'date' || (viewMode === 'cluster' && type === 'group')) {
			const date = new Date(Date.parse(key));
			if(!isValid(date)) {
				return ucfirst(key.replace('_', ' '));
			}

			return date.toLocaleDateString('en-AU', {
				day: 'numeric',
				weekday: 'short',
				month: 'short'
			});
		}
		else {
			return ucfirst(key.replace('_', ' '));
		}
	}


	return (
		<TabNavWrapper>
			<TabNavList>
				{(Array.isArray(items) && type === 'cluster') && (items as AssignmentCluster[]).map((item: AssignmentCluster) => {
					return (
						<TabNavItem key={slugify(item.label)}>
							<TabNavButton tabKey={slugify(item.label)}
							              color={openTab == slugify(item.label) ? getColorForStatus(item.status) : 'light'}
							              aria-selected={openTab === slugify(item.label)}
							              onClick={() => setOpenTab(slugify(item.label))}
							>
								<IconForStatus status={item.status}/>
								<div>
									<strong>{item.label}</strong>
									<small>Ends {item.endDate.toLocaleDateString('en-AU', {
										day: 'numeric',
										weekday: 'short',
										month: 'short'
									})}</small>
								</div>
							</TabNavButton>
						</TabNavItem>
					);
				})}
				{(!Array.isArray(items) && type === 'group') && Object.keys(items)?.map(key => {
					// @ts-ignore
					if(items[key].length < 1) {
						return null;
					}
					return (
						<TabNavItem key={key}>
							{/* eslint-disable-next-line max-len */}
							<TabNavButton tabKey={viewMode === 'grade' ? slugify(targetGrades?.find(grade => grade?.value === parseInt((key)))?.label as string) : key}
							              color={openTab == key ? getColorForStatus(key) : 'light'}
							              aria-selected={openTab === key}
							              onClick={() => setOpenTab(key)}
							>
								<IconForStatus status={key}/>
								{getTabLabel(key)}
							</TabNavButton>
						</TabNavItem>
					);
				})}
			</TabNavList>
		</TabNavWrapper>
	);
};

export default TabNav;
