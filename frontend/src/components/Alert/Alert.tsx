import { FC } from 'react';
import { AlertWrapper } from './Alert.styled';
import { StatusColor } from '../../types.ts';

interface AlertProps {
	type: StatusColor;
	message: string;
	more?: string;
}

const Alert: FC<AlertProps> = (props) => (
	<AlertWrapper type={props.type} data-component-id="Alert">
		<p><strong>{props.message}</strong></p>
		{props.more && <span>{props.more}</span>}
	</AlertWrapper>
);

export default Alert;
