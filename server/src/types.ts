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
	id: number;
	unitId: number;
	abbreviation: string;
	name: string;
	description: string;
	status: TaskStatus;
	targetDate: string;
	dueDate: string;
	submissionDate: string;
	completionDate: string;
	weighting: number;
	isGraded: boolean;
	maxPoints: number;
	awardedPoints: number;
}

