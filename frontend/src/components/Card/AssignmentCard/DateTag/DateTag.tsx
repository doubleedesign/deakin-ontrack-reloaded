import React, { FC } from 'react';
import { Label } from '../../../common.styled.ts';

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
		<Label color={color}>{month}&nbsp;{day}</Label>
	);
};

export default DateTag;
