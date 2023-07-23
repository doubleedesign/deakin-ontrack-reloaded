import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export function slugify(text: string) {
	return text.replace(/\s/g, '-').toLowerCase();
}

export function ucfirst(text: string) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

export function object_key_first(obj: object) {
	if(typeof obj !== 'object') {
		return undefined;
	}
	return Object.keys(obj)[0];
}

export function getColorForStatus(status: string) {
	switch(status) {
		case 'working_on_it':
			return 'secondary';
		case 'not_started':
			return 'info';
		case 'discuss':
			return 'warning';
		case 'fix_and_resubmit':
			return 'error';
		case 'need_help':
			return 'info';
		case 'time_exceeded':
		case 'feedback_exceeded':
			return 'error';
		case 'complete':
			return 'success';
		default:
			return 'bodyText';
	}
}
