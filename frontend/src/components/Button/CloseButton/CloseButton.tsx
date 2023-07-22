import React, { FC } from 'react';
import { CloseButtonElement } from './CloseButton.styled.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ScreenReaderText } from '../../common.styled.ts';

interface CloseButtonProps {
	onClick: () => any;
	onKeyUp?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

const CloseButton: FC<CloseButtonProps> = ({ onClick, onKeyUp }) => (
	<CloseButtonElement data-component-id="CloseButton" onClick={onClick} onKeyUp={onKeyUp}>
		<FontAwesomeIcon icon={['fal', 'xmark']}/>
		<ScreenReaderText>Close panel</ScreenReaderText>
	</CloseButtonElement>
);

export default CloseButton;
