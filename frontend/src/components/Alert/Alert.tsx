import { FC } from 'react';
import { AlertWrapper } from './Alert.styled';

interface AlertProps {
	message: string;
	more?: string;
}

const Alert: FC<AlertProps> = (props) => (
	<AlertWrapper>
		<p><strong>{props.message}</strong></p>
		{props.more && <span>{props.more}</span>}
	</AlertWrapper>
);

export default Alert;
