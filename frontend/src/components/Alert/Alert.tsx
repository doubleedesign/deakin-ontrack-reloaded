import { FC, PropsWithChildren } from 'react';
import { AlertWrapper } from './Alert.styled';
import { StatusColor } from '../../types.ts';

interface AlertProps {
	type: StatusColor;
}

const Alert: FC<PropsWithChildren<AlertProps>> = ({ children, type }) => (
	<AlertWrapper type={type} data-component-id="Alert">
		{children}
	</AlertWrapper>
);

export default Alert;
