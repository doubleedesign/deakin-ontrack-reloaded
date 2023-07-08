import {
	ProjectDetail,
	ProjectOverview,
	Task,
	TaskDefinition,
	UnitDetail,
	UnitOverview
} from '@server/ontrack/types.ts';
import { rndm } from '@doubleedesign/random-simple';
import random from 'lodash/random.js';
import pick from 'lodash/pick.js';

interface OnTrackMock {
	overviews: ProjectOverview[],
	projects: ProjectDetail[],
	units: UnitDetail[]
}

const currentTeachingPeriod = 24;
const currentStartDate = '2023-07-10';
const currentEndDate = '2023-10-20';
const userId = 1234;

function randomUnitCode() {
	return rndm.letters(3).toString() + random(101, 399);
}

// TODO: Also generate data for previous trimesters

function generateTaskDefs(): TaskDefinition[] {
	return []; // TODO: Generate mock task definitions
}

function generateTasks(): Task[] {
	return []; // TODO: Generate tasks
}

function generateUnits(): UnitDetail[] {
	// https://en.wikipedia.org/wiki/List_of_Community_episodes
	const names = [
		'Emotional Consequences of Broadcast Television',
		'Pascal\'s Triangle Revisited',
		'Urban Matrimony and the Sandwich Arts',
		'App Development and Condiments'
	];

	return names.map((name: string) => {
		return {
			id: rndm.numbers(3) as number,
			code: randomUnitCode(),
			name: name,
			start_date: currentStartDate,
			end_date: currentEndDate,
			my_role: 'Student',
			teaching_period_id: currentTeachingPeriod,
			active: true,
			description: '',
			main_convenor_id: rndm.numbers(4) as number,
			assessment_enabled: true,
			allow_student_extension_requests: true,
			allow_student_change_tutorial: false,
			ilos: [], // TODO: Generate mock learning outcomes
			tutorials: [],
			tutorial_streams: [],
			task_definitions: generateTaskDefs(),
			task_outcome_alignments: [],
			staff: [],
			group_sets: [],
			groups: []
		};
	});
}

const units: UnitDetail[] = generateUnits();

function generateProjects(): ProjectDetail[] {
	return units.map(unit => {
		return {
			id: rndm.numbers(5) as number,
			campus_id: 2,
			target_grade: random(2, 4),
			portfolio_available: false,
			unit: pick(unit, ['id', 'code', 'name', 'start_date', 'end_date', 'my_role', 'teaching_period_id', 'active']),
			user_id: userId,
			unit_id: unit.id,
			submitted_grade: 0,
			portfolio_files: [],
			compile_portfolio: false,
			uses_draft_learning_summary: false,
			tasks: generateTasks(),
			tutorial_enrolments: [],
			groups: [],
			task_outcome_alignments: []
		};
	});
}

const projects: ProjectDetail[] = generateProjects();

export const db: OnTrackMock = {
	overviews: projects.map(project => {
		return pick(project, ['id', 'campus_id', 'target_grade', 'portfolio_available', 'unit', 'user_id']);
	}),
	projects: projects,
	units: units
};
