import React, { FC } from 'react';
import { IconForStatusWrapper } from './IconForStatus.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getColorForStatus } from '../../utils.ts';

interface IconForStatusProps {
	status: string;
}

const IconForStatus: FC<IconForStatusProps> = ({ status }) => {
	function getIcon(status: string): JSX.Element {
		switch(status) {
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
				return <FontAwesomeIcon icon={['fas', 'circle-check']}/>;
			default:
				return <FontAwesomeIcon icon={['fas', 'list-ul']}/>;
		}
	}

	return (
		<IconForStatusWrapper color={getColorForStatus(status)} data-component-id="IconForStatus">
			{getIcon(status)}
		</IconForStatusWrapper>
	);
};

export default IconForStatus;
