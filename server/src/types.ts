import { Ontrack } from './datasources/OnTrack/ontrack';
import { TaskStatus } from './datasources/OnTrack/types';
import { DeakinSync } from './datasources/DeakinSync/deakinsync';

export type ServerContext = {
	datasources: {
		onTrack: Ontrack,
		deakinSync: DeakinSync
	}
}

type SubjectUrl = {
	label: string;
	url: string;
}

export type Subject = {
	projectId: number;
	unitId: number;
	unitCode: string;
	name: string;
	targetGrade: number;
	color?: string;
	urls: SubjectUrl[];
}

export type Assignment = {
	id: number; // The OnTrack Task Definition ID, because Tasks aren't created until you do something with them
	projectId: number;
	unitId: number;
	abbreviation: string;
	name: string;
	description: string;
	status: TaskStatus;
	target_date: string;
	due_date: string;
	submission_date: string;
	completion_date: string;
	weighting: number;
	is_graded: boolean;
	maxPoints: number;
	awardedPoints: number;
}

