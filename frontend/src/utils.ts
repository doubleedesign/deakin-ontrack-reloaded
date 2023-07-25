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
		return '';
	}
	return Object.keys(obj)[0];
}

export function getColorForStatus(status: string) {
	switch(status) {
		case 'working_on_it':
			return 'info';
		case 'not_started':
			return 'info';
		case 'discuss':
		case 'fix_and_resubmit':
			return 'warning';
		case 'need_help':
		case 'ready_for_feedback':
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

export function isHexColor(str: string): boolean {
	const matches = str.match(/[0-9A-Fa-f]{6}/g);
	if(!matches) {
		return false;
	}
	else if(matches.length > 0) {
		return true;
	}
	return false;
}
