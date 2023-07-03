import { Ontrack } from './datasources/ontrack';

export type ServerContext = {
	datasources: {
		onTrack: Ontrack
	}
}

export type RawUnit = {
	campus_id: number;
	id: number;
	portfolio_available: boolean;
	target_grade: number;
	unit: Unit;
	user_id: number;
}

export type Unit = {
	active: boolean;
	code: string;
	name: string;
	id: string;
	start_date: string;
	end_date: string;
	my_role: string;
	teaching_period: number;
}
