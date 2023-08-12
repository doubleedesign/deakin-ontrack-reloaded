import { Ontrack } from './datasources/OnTrack/ontrack';
import { TaskStatus } from './datasources/OnTrack/types';
import { DeakinSync } from './datasources/DeakinSync/deakinsync';
import { CloudDeakin } from './datasources/CloudDeakin/clouddeakin';

// Note: As a general rule, the idea is that snake_case fields are brought in as-is from the API and camelCase are ones I've added/customised

export type ServerContext = {
	datasources: {
		onTrack: Ontrack,
		deakinSync: DeakinSync,
		cloudDeakin: CloudDeakin
	}
}

export type PersistentCacheStatus = {
	DeakinSync: Date;
	CloudDeakin: Date;
	OnTrack: Date;
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
	startDate: string;
	endDate: string;
	color?: string;
	isOnTrackUnit: boolean;
	urls: SubjectUrl[];
}

export type Assignment = {
	id: number; // For OnTrack, use Task Definition ID because Tasks aren't created until you do something with them
	type?: string;
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
	target_grade: number;
	is_graded: boolean;
	maxPoints: number;
	awardedPoints: number;
}

export type AssignmentDetail = {
	isOnTrackUnit: boolean;
	taskSheetUrl: string;
	taskResourcesUrl: string
}

export type AssignmentGroup = {
	[key: string]: Assignment[]
}

export type AssignmentCluster = {
	label: string;
	endDate: Date;
	assignments: Assignment[];
	status: string;
}

