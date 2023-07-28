import React, { FC } from 'react';
import { ButtonGroupWrapper } from './ButtonGroup.styled';
import { StyledButton } from '../Button/Button.styled.ts';

interface ButtonGroupItem {
	label: string;
	onClick: () => any;
	active: boolean;
}

interface ButtonGroupProps {
	buttons: ButtonGroupItem[]
}

const ButtonGroup: FC<ButtonGroupProps> = ({ buttons }) => {
	return (
		<ButtonGroupWrapper>
			{buttons.map((button: ButtonGroupItem, index: number) => {
				return (
					<StyledButton key={`button-${index}`}
					              color={button.active ? 'logo' : 'light'}
					              onClick={button.onClick}
					>
						{button.label}
					</StyledButton>
				);
			})}
		</ButtonGroupWrapper>
	);
};

export default ButtonGroup;
