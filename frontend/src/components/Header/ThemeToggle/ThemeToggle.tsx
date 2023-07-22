import React, { FC, useCallback, useContext } from 'react';
import { ThemeToggleButton } from './ThemeToggle.styled.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppContext } from '../../../context/AppContextProvider.tsx';
import { ScreenReaderText } from '../../common.styled.ts';

const ThemeToggle: FC = () => {
	const { theme, setTheme } = useContext(AppContext);

	const changeTheme = useCallback(function() {
		if (theme === 'light') {
			setTheme('dark');
		}
		else {
			setTheme('light');
		}
	}, [theme, setTheme]);

	return (
		<ThemeToggleButton onClick={changeTheme}>
			{theme === 'light' ? <FontAwesomeIcon icon={['fal', 'lightbulb-on']}/> : <FontAwesomeIcon icon={['fas', 'lightbulb']}/>}
			<ScreenReaderText>Change interface theme</ScreenReaderText>
		</ThemeToggleButton>
	);
};

export default ThemeToggle;
