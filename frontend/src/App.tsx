import React, { FC, useState, useContext, useEffect } from 'react';
import { AppContext } from './context/AppContextProvider.tsx';
import Header from './components/Header/Header.tsx';
import Alert from './components/Alert/Alert.tsx';
import { AppWrapper, Row } from './components/common.styled.ts';
import { lightTheme, darkTheme } from './theme.ts';
import { ThemeProvider } from 'styled-components';
import TabMenu from './components/TabMenu/TabMenu.tsx';
import { MenuItem } from './types.ts';
import { RouterProvider } from 'react-router-dom';

interface AppProps {
	router: any
}

const App: FC<AppProps> = (props) => {
	const { theme, currentSubjects, errors, setErrors } = useContext(AppContext);
	const defaultMenuItems: MenuItem[] = [{ route: '/', label: 'Home' }];
	const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);


	useEffect(() => {
		const items = currentSubjects.map(subject => ({
			route: `/${subject.projectId}`,
			label: subject.unitCode.split('/')[0]
		}));
		setMenuItems([...defaultMenuItems, ...items]);
	}, [currentSubjects]);

	return (
		<ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
			<AppWrapper>
				<Header/>
				<TabMenu items={menuItems}/>
				<Row>
					{errors && errors.map((error, index) => {
						console.error(`${error.extensions?.code} ${error.message} ${error.extensions?.stacktrace as string}`);
						return (
							<Alert key={`error-${index}`}
							       message={`${error.extensions?.code} ${error.message}`}
							       more={error.extensions?.note as string}
							/>
						);
					})}
				</Row>
				<RouterProvider router={props.router} />
			</AppWrapper>
		</ThemeProvider>
	);
};

export default App;
