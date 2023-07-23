import React, { FC, PropsWithChildren } from 'react';
import { CardWrapper } from './Card.styled';
import IconForStatus from '../IconForStatus/IconForStatus.tsx';
import { getColorForStatus } from '../../utils.ts';
import DateInterval from '../DateInterval/DateInterval.tsx';
import DateTag from '../DateTag/DateTag.tsx';

interface CardProps {
	title: string;
	status: string;
	dueDate: string;
}

const Card: FC<PropsWithChildren<CardProps>> = ({ title, status, dueDate, children }) => {
	return (
		<CardWrapper color={getColorForStatus(status)} data-component-id="Card">
			<IconForStatus status={status}/>
			<div>
				<h3>{title}</h3>
				{children}
				<DateInterval date={dueDate} color={getColorForStatus(status)}/>
			</div>
			<DateTag date={dueDate} color={getColorForStatus(status)}/>
		</CardWrapper>
	);
};

export default Card;
