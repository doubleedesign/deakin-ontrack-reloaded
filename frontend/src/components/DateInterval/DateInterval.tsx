import React, { FC } from 'react';
import { DateIntervalWrapper } from './DateInterval.styled';
import { isSameDay, eachWeekOfInterval, intervalToDuration, isBefore } from 'date-fns';

interface DateIntervalProps {
	date: string;
	color: string;
}

const DateInterval: FC<DateIntervalProps> = ({ date, color }) => {
	const dueDate: Date = new Date(Date.parse(date));
	const today = new Date();
	let timeStatement = '';
	let note = '';

	const timeLeft = intervalToDuration({
		start: today,
		end: dueDate
	});

	if(timeLeft.months && timeLeft.months > 0) {
		const weeksLeft = eachWeekOfInterval({
			start: today,
			end: dueDate
		}).length - 1;

		timeStatement = `Due in about ${weeksLeft} weeks`;
	}
	else {
		if(isSameDay(today, dueDate)) {
			timeStatement = 'Due today';
		}
		else if(isBefore(dueDate, today)) {
			timeStatement = 'Overdue';
		}
		// @ts-ignore
		else if(timeLeft.days < 1) {
			timeStatement = 'Due tomorrow';
		}
		else if(timeLeft.days === 1) {
			timeStatement = 'Due in 1 day';
		}
		// @ts-ignore
		else if(timeLeft.days < 7) {
			timeStatement = `Due in about ${timeLeft.days} days`;
			note = `(on ${dueDate.toLocaleDateString('en-AU', { weekday: 'long' })})`;
		}
		// @ts-ignore
		else if(timeLeft.days > 14) {
			// @ts-ignore
			timeStatement = `Due in about ${Math.floor(timeLeft.days / 7)} weeks`;
		}
		else {
			timeStatement = `Due in about ${timeLeft.days} days`;
		}
	}


	return (
		<DateIntervalWrapper color={color}>
			{timeStatement}
			<strong>{note}</strong>
		</DateIntervalWrapper>
	);
};

export default DateInterval;
