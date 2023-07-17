import React, { FC, useContext } from 'react';
import { AppContext } from '../../context/AppContextProvider.tsx';
import LoginForm from '../LoginForm/LoginForm.tsx';
import Drawer from '../Drawer/Drawer.tsx';

const UserDrawer: FC = () => {
	const { userDrawerOpen, setUserDrawerOpen } = useContext(AppContext);

	return (
		<Drawer title="Settings" isOpen={userDrawerOpen} onClose={() => setUserDrawerOpen(false)}>
			<LoginForm/>
		</Drawer>
	);
};

export default UserDrawer;
