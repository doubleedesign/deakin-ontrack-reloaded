import React, { FC, useState, useContext, useEffect } from 'react';
import { AppContext } from './context/AppContextProvider.tsx';
import Header from './components/Header/Header.tsx';
import Alert from './components/Alert/Alert.tsx';
import { AppWrapper, Panel, Row } from './components/common.styled.ts';
import { lightTheme, darkTheme } from './theme.ts';
import { ThemeProvider } from 'styled-components';
import TabMenu from './components/TabMenu/TabMenu.tsx';
import { MenuItem } from './types.ts';
import { Outlet } from 'react-router-dom';
import { Subject } from '@server/types.ts';
import Messages from './components/Messages/Messages.tsx';

const App: FC = (props) => {
	const { theme, currentSubjects } = useContext(AppContext);
	const defaultMenuItems: MenuItem[] = [{ route: '/', label: 'Home', color: '#FFF' }];
	const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);

	useEffect(() => {
		const items: MenuItem[] = currentSubjects.map((subject: Subject) => ({
			route: `/${subject.projectId}`,
			label: subject.unitCode.split('/')[0],
			color: subject.color ?? '#FFF'
		}));
		setMenuItems([...defaultMenuItems, ...items]);
	}, [currentSubjects]);

	return (
		<ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
			<AppWrapper>
				<Header/>
				<TabMenu items={menuItems}/>
				<Panel>
					<Messages/>
					<Outlet/>
				</Panel>
			</AppWrapper>
		</ThemeProvider>
	);
};

export default App;
