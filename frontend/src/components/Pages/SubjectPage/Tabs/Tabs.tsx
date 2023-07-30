import React, { FC, useCallback, useEffect, useState } from 'react';
import { TabContentWrapper, TabNavButton, TabNavItem, TabNavList, TabNavWrapper, TabPanels, TabSection } from './Tabs.styled.ts';
import { getColorForStatus, getTypes, object_key_first, slugify, ucfirst } from '../../../../utils.ts';
import IconForStatus from '../../../IconForStatus/IconForStatus.tsx';
import { targetGrades } from '../../../../constants.ts';
import { Row } from '../../../common.styled.ts';
import { Assignment, AssignmentCluster, AssignmentGroup } from '@server/types';
import AssignmentCard from '../../../AssignmentCard/AssignmentCard.tsx';
import { SubjectViewMode } from '../../../../types.ts';
import { isValid } from 'date-fns';
import Loading from '../../../Loading/Loading.tsx';
import TabNav from './TabNav.tsx';
import TabContent from './TabContent.tsx';

interface TabProps {
	items: AssignmentGroup | AssignmentCluster[] | undefined;
	viewMode: SubjectViewMode;
}

const Tabs: FC<TabProps> = ({ items, viewMode }) => {
	const [openTab, setOpenTab] = useState<string>('');
	const [type, setType] = useState<'cluster'|'group'>('group');
	const [loading, setLoading] = useState<boolean>(true);

	const getMeTheTypes = useCallback(async function (): Promise<string[]> {
		return await getTypes(Array.isArray(items) ? items[0] : items).then(response => response);
	}, [items]);

	const handleTheType = useCallback(function (types: string[]): void {
		if(items && types && types.includes('AssignmentCluster')) {
			setType('cluster');
			// @ts-ignore
			setOpenTab(slugify(items[0].label));
		}
		else {
			setType('group');
			setOpenTab(object_key_first(items as AssignmentGroup));
		}
	}, [items]);

	useEffect( () => {
		if(!items) {
			setLoading(true);
		}
		else {
			getMeTheTypes().then(response => handleTheType(response));
			setLoading(false);
		}
	}, [getMeTheTypes, handleTheType, items]);


	return (
		<section data-component-id="TabbedSection">
			{loading ?
				<Loading/>
				:
				<TabSection>
					{items && <TabNav items={items} type={type} viewMode={viewMode} openTab={openTab} setOpenTab={setOpenTab} />}
					{items && <TabContent items={items} type={type} viewMode={viewMode} openTab={openTab} />}
				</TabSection>
			}
		</section>
	);
};

export default Tabs;
