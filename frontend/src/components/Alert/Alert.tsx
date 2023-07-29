import { FC, PropsWithChildren } from 'react';
import { AlertWrapper } from './Alert.styled';
import { StatusColor } from '../../types.ts';
import { Container } from '../common.styled.ts';

interface AlertProps {
	type: StatusColor;
	size?: string;
}

const Alert: FC<PropsWithChildren<AlertProps>> = ({ children, type, size }) => (
	<AlertWrapper data-component-id="Alert" type={type} size={size}>
		{children}
	</AlertWrapper>
);

export default Alert;
