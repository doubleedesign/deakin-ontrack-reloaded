import React, { FC, PropsWithChildren } from 'react';
import { TooltipWrapper } from './Tooltip.styled';

interface TooltipProps {
	text: string;
}

const Tooltip: FC<PropsWithChildren<TooltipProps>> = ({ text }) => (
	<TooltipWrapper>
		<div>
			<span>{text}</span>
		</div>
	</TooltipWrapper>
);

export default Tooltip;
