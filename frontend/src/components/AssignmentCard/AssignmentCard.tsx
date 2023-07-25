import React, { FC, PropsWithChildren } from 'react';
import { CardWrapper } from './AssignmentCard.styled.ts';
import IconForStatus from '../IconForStatus/IconForStatus.tsx';
import { getColorForStatus } from '../../utils.ts';
import DateInterval from '../DateInterval/DateInterval.tsx';
import DateTag from '../DateTag/DateTag.tsx';
import { DateIntervalWrapper } from '../DateInterval/DateInterval.styled.ts';

interface CardProps {
	title: string;
	status: string;
	dueDate: string;
}

const AssignmentCard: FC<PropsWithChildren<CardProps>> = ({ title, status, dueDate, children }) => {
	return (
		<CardWrapper color={getColorForStatus(status)} data-component-id="AssignmentCard">
			<IconForStatus status={status}/>
			<div>
				<h3>{title}</h3>
				{children}
				{status === 'complete' && <DateIntervalWrapper color={getColorForStatus('complete')}>Complete</DateIntervalWrapper>}
				{status === 'ready_for_feedback' && <DateIntervalWrapper color={getColorForStatus('ready_for_feedback')}>Submitted</DateIntervalWrapper>}
				{!['complete', 'ready_for_feedback'].includes(status) && <DateInterval date={dueDate} color={getColorForStatus(status)}/>}
			</div>
			<DateTag date={dueDate} color={getColorForStatus(status)}/>
		</CardWrapper>
	);
};

export default AssignmentCard;
