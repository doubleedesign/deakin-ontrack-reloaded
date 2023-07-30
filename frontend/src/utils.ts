export async function getTypes(obj: object | undefined) {
	if (!obj) {
		return undefined;
	}

	const response = await fetch('http://localhost:5000/typecheck', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(obj),
		redirect: 'manual'
	});

	return await response.json();
}

export function slugify(text: string) {
	if(!text) {
		return '';
	}

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
		case 'tomorrow':
		case 'this_week':
		case 'upcoming':
		case 'discuss':
		case 'fix_and_resubmit':
			return 'warning';
		case 'need_help':
		case 'ready_for_feedback':
			return 'info';
		case 'overdue':
		case 'today':
		case 'time_exceeded':
		case 'feedback_exceeded':
			return 'error';
		case 'complete':
		case 'done':
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
