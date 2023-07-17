import React, { FC } from 'react';
import { TabMenuWrapper, TabMenuList, TabMenuListItem, TabMenuNavLink } from './TabMenu.styled';
import { MenuItem } from '../../types.ts';
import { slugify } from '../../utils.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ScreenReaderText } from '../common.styled.ts';

interface TabMenuProps {
	items: MenuItem[]
}

const TabMenu: FC<TabMenuProps> = ({ items }) => {

	return (
		<TabMenuWrapper>
			<TabMenuList>
				{items.map((item) => (
					<TabMenuListItem key={item.label} className={`tab-${slugify(item.label)}`}>
						<TabMenuNavLink to={item.route} color={item.color}>
							<span>
								{item.label === 'Home' ?
									<>
										<FontAwesomeIcon icon={['fas', 'list-ul']}/>
										<ScreenReaderText>Home</ScreenReaderText>
									</>
									: item.label
								}
							</span>
						</TabMenuNavLink>
					</TabMenuListItem>
				))}
			</TabMenuList>
		</TabMenuWrapper>
	);
};

export default TabMenu;
