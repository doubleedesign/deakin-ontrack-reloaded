import React, { FC } from 'react';
import { DateWrapper } from './DateTag.styled';

interface DateTagProps {
	date: string;
	color: string;
}

const DateTag: FC<DateTagProps> = ({ date, color }) => {
	const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const dateData: Date = new Date(Date.parse(date));
	const day = dateData.getDate();
	const month = monthLabels[dateData.getMonth()];

	return (
		<DateWrapper color={color}>{month}&nbsp;{day}</DateWrapper>
	);
};

export default DateTag;
