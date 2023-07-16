import React, { FC, useState, useContext, useMemo, useEffect } from 'react';
import { AppContext } from './context/AppContextProvider.tsx';
import Header from './components/Header/Header.tsx';
import { AppWrapper, Row } from './components/common.styled.ts';
import { lightTheme, darkTheme } from './theme.ts';
import { ThemeProvider } from 'styled-components';
import TabMenu from './components/TabMenu/TabMenu.tsx';
import { MenuItem } from './types.ts';
import { Outlet } from 'react-router-dom';
import { Subject } from '@server/types.ts';
import Footer from './components/Footer/Footer.tsx';

const App: FC = (props) => {
	const { theme, currentSubjects } = useContext(AppContext);
	const defaultMenuItems: MenuItem[] = useMemo(() => [{ route: '/', label: 'Home', color: '#FFF' }], []);
	const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);

	useEffect(() => {
		const items: MenuItem[] = currentSubjects.map((subject: Subject) => ({
			route: `/${subject.projectId}`,
			label: subject.unitCode.split('/')[0],
			color: subject.color ?? '#FFF'
		}));
		setMenuItems([...defaultMenuItems, ...items]);
	}, [currentSubjects, defaultMenuItems]);

	return (
		<ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
			<AppWrapper>
				<Header/>
				<TabMenu items={menuItems}/>
				<Outlet/>
				<Footer/>
			</AppWrapper>
		</ThemeProvider>
	);
};

export default App;
