import {
	ProjectDetail,
	ProjectOverview,
	Task,
	TaskDefinition,
	UnitDetail,
} from '@server/ontrack/types.ts';
import { unitNames } from './funMockData/unitNames.js';
import { taskNames } from './funMockData/taskNames.js';
import { rndm } from '@doubleedesign/random-simple';
import random from 'lodash/random.js';
import pick from 'lodash/pick.js';
import sampleSize from 'lodash/sampleSize.js';
import { add, format } from 'date-fns';
import * as fs from 'fs';


interface OnTrackMock {
	overviews: ProjectOverview[],
	projects: ProjectDetail[],
	units: UnitDetail[]
}

const currentTeachingPeriod: number = 24;
const trimesterStartDate: string = '2023-07-10';
const trimesterEndDate: string = '2023-10-20';
const userId: number = 1234;

function randomUnitCode() {
	return rndm.letters(3).toString() + random(101, 399);
}

function generateTaskDef({ week, name, abbreviation, description = '', target_grade = 0, weighting = 0 }) {

	// stuff that can be the same for all because I'm not using it at this stage
	const baseFields = {
		upload_requirements: [],
		tutorial_stream_abbr: '',
		plagiarism_checks: [],
		plagiarism_report_url: '',
		restrict_status_updates: false,
		group_set_id: null,
		has_task_sheet: true,
		has_task_resources: true,
		is_graded: false,
		max_quality_pts: 0,
		overseer_image_id: null,
		assessment_enabled: true
	};

	const offset = week - 1 >= 0 ? week - 1 : 0;

	return {
		id: rndm.numbers(5) as number,
		name: name,
		abbreviation: abbreviation, // TODO: Could this be easily auto-generated based on other fields?
		description: description,
		target_grade: target_grade,
		start_date: format(add(Date.parse(trimesterStartDate), { weeks: offset }), 'yyyy-LL-dd').toString(),
		// TODO: Account for the target grade for target and due dates, i.e. the higher the grade the more time you get
		target_date: format(add(Date.parse(trimesterStartDate), { weeks: offset }), 'yyyy-LL-dd'),
		due_date: format(add(Date.parse(trimesterStartDate), { weeks: week }), 'yyyy-LL-dd'),
		weighting: weighting,
		...baseFields
	};
}

function generatePrettyStandardTaskDefs() {
	const defs: TaskDefinition[] = [];
	const howMany = random(10, 14);
	const names = sampleSize(taskNames, howMany);
	let count = 0;
	for(let i = 1; i <= (howMany - 6); i++) {
		defs.push(generateTaskDef({
			week: i,
			name: names[count],
			abbreviation: `${i}.1P`,
			target_grade: 0
		}));
		count++;
	}
	// If changing the random generation of how many tasks to have,
	// make sure these are correctly accounted for in the pass task loop above
	defs.push(generateTaskDef({ week: 2, name: names[8], abbreviation: '2.2C', target_grade: 1 }));
	defs.push(generateTaskDef({ week: 5, name: names[9], abbreviation: '5.2C', target_grade: 1 }));
	defs.push(generateTaskDef({ week: 5, name: names[10], abbreviation: '5.3C', target_grade: 1 }));
	defs.push(generateTaskDef({ week: 7, name: names[11], abbreviation: '7.2D', target_grade: 2 }));
	defs.push(generateTaskDef({ week: 9, name: names[12], abbreviation: '9.2D', target_grade: 2 }));
	defs.push(generateTaskDef({ week: 10, name: names[13], abbreviation: '11.1HD', target_grade: 3 }));

	return defs;
}

function generateTaskDefsWithNondescriptNames() {
	const defs: TaskDefinition[] = [];
	for(let i = 1; i <= 8; i++) {
		defs.push(generateTaskDef({
			week: i,
			name: `Task ${i}.1P`,
			abbreviation: `${i}.1P`,
			target_grade: 0
		}));
	}
	defs.push(generateTaskDef({ week: 2, name: 'Task 2.2C', abbreviation: '2.2C', target_grade: 1 }));
	defs.push(generateTaskDef({ week: 5, name: 'Task 5.2C', abbreviation: '5.2C', target_grade: 1 }));
	defs.push(generateTaskDef({ week: 5, name: 'Task 5.3C', abbreviation: '5.3C', target_grade: 1 }));
	defs.push(generateTaskDef({ week: 7, name: 'Task 8.2D', abbreviation: '8.2D', target_grade: 2 }));
	defs.push(generateTaskDef({ week: 7, name: 'Task 10.2C', abbreviation: '10.2C', target_grade: 1 }));
	defs.push(generateTaskDef({ week: 9, name: 'Task 10.3D', abbreviation: '10.3D', target_grade: 2 }));
	defs.push(generateTaskDef({ week: 10, name: 'Task 11.1HD', abbreviation: '11.1HD', target_grade: 3 }));

	return defs;
}

function generateWayTooManyTaskDefs() {
	const defs: TaskDefinition[] = [];
	const names = sampleSize(taskNames, 30);
	let count = 0;
	while(count <= 30) {
		for (let i = 1; i <= 30; i++) {
			for (let j = 1; j < random(1, 4); j++) {
				const targetGrade = random(0, 3);
				const grades = ['P', 'C', 'D', 'HD'];
				defs.push(generateTaskDef({
					week: i,
					name: names[count],
					description: '', // TODO
					abbreviation: `${i}.${j}${grades[targetGrade]}`,
					target_grade: targetGrade
				}));
			}
		}
		count++;
	}

	return defs;
}

function generateTasks(): Task[] {
	return []; // TODO: Generate tasks; noting that they need to link to task definitions
}

function generateUnits(): UnitDetail[] {

	return unitNames.map((name: string, index: number) => {
		let whichTaskDefs;
		if(index === 2) {
			whichTaskDefs = generateTaskDefsWithNondescriptNames();
		}
		else if(index === 3) {
			whichTaskDefs = generateWayTooManyTaskDefs();
		}
		else {
			whichTaskDefs = generatePrettyStandardTaskDefs();
		}

		return {
			id: rndm.numbers(3) as number,
			code: randomUnitCode(),
			name: name,
			start_date: trimesterStartDate,
			end_date: trimesterEndDate,
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
			task_definitions: whichTaskDefs,
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


function generate(): void {
	const db: OnTrackMock = {
		overviews: projects.map(project => {
			return pick(project, ['id', 'campus_id', 'target_grade', 'portfolio_available', 'unit', 'user_id']);
		}),
		projects: projects,
		units: units
	};


	fs.writeFileSync('./src/data.json', JSON.stringify(db, null, 4));
}

generate();

