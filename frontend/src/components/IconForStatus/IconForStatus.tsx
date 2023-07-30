import React, { FC } from 'react';
import { IconForStatusWrapper } from './IconForStatus.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getColorForStatus } from '../../utils.ts';
import { isValid } from 'date-fns';
import { targetGrades } from '../../constants.ts';

interface IconForStatusProps {
	status: string;
}

const IconForStatus: FC<IconForStatusProps> = ({ status }) => {
	function getIcon(status: string): JSX.Element {
		if(isValid(new Date(Date.parse(status)))) {
			return <FontAwesomeIcon icon={['fad', 'calendar-lines']}/>;
		}

		if(['0', '1', '2', '3'].includes(status)) { // we're probably looking at a grade
			const grade = targetGrades.find(grade => {
				return grade.value === Number(status);
			});
			switch(grade?.label) {
				case 'Pass':
					return <FontAwesomeIcon icon={['fad', 'circle-quarter']}/>;
				case 'Credit':
					return <FontAwesomeIcon icon={['fad', 'circle-half']}/>;
				case 'Distinction':
					return <FontAwesomeIcon icon={['fad', 'circle-three-quarters']}/>;
				case 'High Distinction':
					return <FontAwesomeIcon icon={['fas', 'circle']}/>;
				default:
				 return <></>;
			}

		}

		switch(status) {
			case 'overdue':
				return <FontAwesomeIcon icon={['fas', 'alarm-exclamation']}/>;
			case 'today':
			case 'tomorrow':
				return <FontAwesomeIcon icon={['fas', 'alarm-clock']}/>;
			case 'this_week':
			case 'upcoming':
				return <FontAwesomeIcon icon={['fas', 'calendar-clock']}/>;
			case 'later':
				return <FontAwesomeIcon icon={['fad', 'calendar-lines']}/>;
			case 'working_on_it':
				return <FontAwesomeIcon icon={['fad', 'loader']}/>;
			case 'ready_for_feedback':
				return <FontAwesomeIcon icon={['fas', 'hourglass-half']}/>;
			case 'not_started':
				return <FontAwesomeIcon icon={['fas', 'triangle-exclamation']}/>;
			case 'discuss':
				return <FontAwesomeIcon icon={['fad', 'comments']}/>;
			case 'fix_and_resubmit':
				return <FontAwesomeIcon icon={['fas', 'wrench']}/>;
			case 'need_help':
				return <FontAwesomeIcon icon={['fad', 'comments-question']}/>;
			case 'time_exceeded':
			case 'feedback_exceeded':
				return <FontAwesomeIcon icon={['fas', 'circle-exclamation']}/>;
			case 'complete':
			case 'done':
				return <FontAwesomeIcon icon={['fas', 'circle-check']}/>;
			default:
				return <FontAwesomeIcon icon={['fas', 'list-ul']}/>;
		}
	}

	return (
		<IconForStatusWrapper data-component-id="IconForStatus"
		                      color={getColorForStatus(status)}
		                      className={(Number(status) || status === '0') ? `icon-${targetGrades.find(grade => {
			                      return grade.value === Number(status);
		                      })?.label.toLowerCase()}` : ''}
		>
			{getIcon(status)}
		</IconForStatusWrapper>
	);
};

export default IconForStatus;
