import { Ontrack } from './datasources/OnTrack/ontrack';
import { TaskStatus } from './datasources/OnTrack/types';

export type ServerContext = {
	datasources: {
		onTrack: Ontrack
	}
}

export type Subject = {
	projectId: number;
	unitId: number;
	unitCode: string;
	name: string;
	targetGrade: number;
}

export type Assignment = {
	id: number; // The Task ID, not the Task Definition ID
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

