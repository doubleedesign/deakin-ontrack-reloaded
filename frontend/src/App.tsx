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
import UserDrawer from './components/UserDrawer/UserDrawer.tsx';

const App: FC = (props) => {
	const { theme, currentSubjects } = useContext(AppContext);
	const themeObject = theme === 'light' ? lightTheme : darkTheme;
	const defaultMenuItems: MenuItem[] = useMemo(() => [{ route: '/', label: 'Home', color: themeObject.colors.logo }], []);
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
			<AppWrapper id="AppWrapper">
				<Header/>
				<TabMenu items={menuItems}/>
				<Outlet/>
				<UserDrawer/>
				<Footer/>
			</AppWrapper>
		</ThemeProvider>
	);
};

export default App;
