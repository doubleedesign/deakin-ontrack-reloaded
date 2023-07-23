import React, { FC } from 'react';
import { DateIntervalWrapper } from './DateInterval.styled';
import { eachWeekOfInterval, intervalToDuration } from 'date-fns';

interface DateIntervalProps {
	date: string;
	color: string;
}

const DateInterval: FC<DateIntervalProps> = ({ date, color }) => {
	const dateData: Date = new Date(Date.parse(date));
	let timeStatement = '';
	let note = '';

	const timeLeft = intervalToDuration({
		start: new Date(),
		end: dateData
	});

	if(timeLeft.months && timeLeft.months > 0) {
		const weeksLeft = eachWeekOfInterval({
			start: new Date(),
			end: dateData
		}).length - 1;

		timeStatement = `Due in about ${weeksLeft} weeks`;
	}
	else {
		// @ts-ignore
		if(timeLeft.days < 1) {
			timeStatement = 'Due tomorrow';
		}
		else if(timeLeft.days === 1) {
			timeStatement = 'Due in 1 day';
		}
		// @ts-ignore
		else if(timeLeft.days < 7) {
			timeStatement = `Due in about ${timeLeft.days} days`;
			note = `(on ${dateData.toLocaleDateString('en-AU', { weekday: 'long' })})`;
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
