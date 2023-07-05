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
	targetDate: string;
	dueDate: string;
	status: TaskStatus;
}

