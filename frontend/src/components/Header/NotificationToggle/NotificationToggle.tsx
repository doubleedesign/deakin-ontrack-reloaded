import React, { FC, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContextProvider.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StyledIconButton } from '../../Button/Button.styled.ts';
import { ScreenReaderText } from '../../common.styled.ts';

const NotificationToggle: FC = () => {
	const { authenticated, setDrawerOpen } = useContext(AppContext);
	const [showAuthWarning, setShowAuthWarning] = useState<boolean>(false);

	useEffect(() => {
		if((Object.values(authenticated?.isAuthenticated).some(item => item === false))) {
			setShowAuthWarning(true);
		}
		else {
			setShowAuthWarning(false);
		}
	}, [authenticated?.isAuthenticated]);


	return (
		<>
			{showAuthWarning &&
				<StyledIconButton color="warning" rounded={true} onClick={() => setDrawerOpen('notifications')}>
					<FontAwesomeIcon icon={['fas', 'triangle-exclamation']}/>
					<ScreenReaderText>Auth & cache warning</ScreenReaderText>
				</StyledIconButton>
			}
		</>
	);
};

export default NotificationToggle;
