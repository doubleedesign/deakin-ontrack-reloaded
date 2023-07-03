import { FC } from 'react';
import { AlertWrapper } from './Alert.styled';

interface AlertProps {
	message: string;
	more?: string;
}

const Alert: FC<AlertProps> = (props) => (
	<AlertWrapper>
		<p><strong>{props.message}</strong></p>
		{props.more && <small>{props.more}</small>}
	</AlertWrapper>
);

export default Alert;
