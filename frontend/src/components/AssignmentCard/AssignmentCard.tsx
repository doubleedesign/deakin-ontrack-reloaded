import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { CardInner, CardWrapper, DateDataWrapper } from './AssignmentCard.styled.ts';
import IconForStatus from '../IconForStatus/IconForStatus.tsx';
import { getColorForStatus } from '../../utils.ts';
import DateInterval from './DateInterval/DateInterval.tsx';
import DateTag from './DateTag/DateTag.tsx';
import { add, isBefore, isSameDay, nextSunday } from 'date-fns';
import { Assignment } from '@server/types';
import { DateIntervalWrapper } from './DateInterval/DateInterval.styled.ts';

interface CardProps {
	assignment: Assignment;
}

const AssignmentCard: FC<CardProps> = ({ assignment }) => {
	const [cardStatus, setCardStatus] = useState<string>(assignment.status);

	useEffect(() => {
		const today = new Date();
		const due = new Date(Date.parse(assignment.target_date));
		const sunday = nextSunday(today);

		if(assignment.status === 'complete' || assignment.status === 'ready_for_feedback' || assignment.status === 'discuss' || assignment.status === 'fix_and_resubmit') {
			setCardStatus(assignment.status);
		}
		else if(isBefore(due, today)) {
			setCardStatus('overdue');
		}
		else if(isSameDay(due, today)) {
			setCardStatus('today');
		}
		else if(isSameDay(due, add(today, { days: 1 }))) {
			setCardStatus('tomorrow');
		}
		else if(isBefore(due, sunday) || isSameDay(due, sunday)) {
			setCardStatus('upcoming');
		}
	}, [assignment.target_date, assignment.status]);

	return (
		<CardWrapper data-component-id="AssignmentCard">
			<CardInner>
				<IconForStatus status={cardStatus}/>
				<div>
					<h3>{`${assignment.abbreviation} ${assignment.name}`}</h3>
					<p>{assignment.description}</p>
					<DateDataWrapper>
						{!['complete', 'ready_for_feedback'].includes(assignment.status) &&
							<DateTag date={assignment.target_date} color={getColorForStatus(cardStatus)}/>
						}
						{/* eslint-disable-next-line max-len */}
						<DateInterval date={['complete', 'ready_for_feedback'].includes(assignment.status) ? assignment.completion_date || assignment.submission_date : assignment.target_date}
						              color={getColorForStatus(cardStatus)}
						              status={assignment.status} />
					</DateDataWrapper>
				</div>
			</CardInner>
		</CardWrapper>
	);
};

export default AssignmentCard;
