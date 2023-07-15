import React, { FC } from 'react';
import { TabMenuWrapper } from './TabMenu.styled';
import { MenuItem } from '../../types.ts';

interface TabMenuProps {
	items: MenuItem[]
}

const TabMenu: FC<TabMenuProps> = ({ items }) => {
	console.log(items);
	return (
		<TabMenuWrapper>
			TabMenu Component
		</TabMenuWrapper>
	);
};

export default TabMenu;
