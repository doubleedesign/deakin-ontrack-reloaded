import React, { FC, useContext, useMemo, useEffect, useState } from 'react';
import { DateDataWrapper } from './AssignmentCard.styled.ts';
import IconForStatus from '../../IconForStatus/IconForStatus.tsx';
import { getColorForStatus } from '../../../utils.ts';
import DateInterval from './DateInterval/DateInterval.tsx';
import DateTag from './DateTag/DateTag.tsx';
import { add, isBefore, isSameDay, nextSunday } from 'date-fns';
import { Assignment } from '@server/types';
import { CardInner, CardWrapper } from '../Card.styled.ts';
import { AppContext } from '../../../context/AppContextProvider.tsx';
import { Label } from '../../common.styled.ts';

interface CardProps {
	assignment: Assignment;
	showSubject?: boolean;
}

const AssignmentCard: FC<CardProps> = ({ assignment, showSubject }) => {
	const { currentSubjects } = useContext(AppContext);
	const subject = currentSubjects.find(subject => subject.projectId === assignment.projectId);

	const submitted = useMemo(() => {
		if(assignment.submission_date) {
			return true;
		}
		return false;
	}, [assignment.submission_date]);

	const cardStatus = useMemo(() => {
		const today = new Date();
		const due = new Date(Date.parse(assignment.target_date));
		const sunday = nextSunday(today);

		if(['not_started', 'working_on_it', 'fix_and_resubmit', 'discuss'].includes(assignment.status)) {
			if (isBefore(due, today)) {
				return 'overdue';
			}
			else if (isSameDay(due, today)) {
				return 'today';
			}
			else if (isSameDay(due, add(today, { days: 1 }))) {
				return 'tomorrow';
			}
			else if (isBefore(due, sunday) || isSameDay(due, sunday)) {
				return 'upcoming';
			}
		}
		return assignment.status;
	}, [assignment.target_date, assignment.status]);

	return (
		<CardWrapper>
			<CardInner withBorder={showSubject ? subject?.color : null}>
				<div>
					<h3>
						{showSubject && <Label color={subject?.color as string}>{subject?.unitCode}</Label>}
						{`${assignment.abbreviation} ${assignment.name}`}
					</h3>
					<p>{assignment.description}</p>
					<DateDataWrapper>
						<IconForStatus status={cardStatus}/>
						{!['complete', 'ready_for_feedback'].includes(assignment.status) &&
							<DateTag date={assignment.target_date} color={getColorForStatus(cardStatus)}/>
						}
						{/* eslint-disable-next-line max-len */}
						<DateInterval date={['complete', 'ready_for_feedback', 'time_exceeded', 'feedback_exceeded'].includes(assignment.status) ? assignment.completion_date || assignment.submission_date : assignment.target_date}
						              color={getColorForStatus(cardStatus)}
						              status={assignment.status} />
					</DateDataWrapper>
				</div>
			</CardInner>
		</CardWrapper>
	);
};

export default AssignmentCard;
