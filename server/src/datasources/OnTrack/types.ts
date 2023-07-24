
/**
 * These are the data types returned from the OnTrack API.
 * Where I have marked a field's type as unknown[], in most cases it essentially means "not using, don't care".
 * If those fields are to be used later, the unknown[]s should be replaced with the real types.
 */
export type ProjectOverview = {
	id: number;
	campus_id: number;
	target_grade: number;
	portfolio_available: boolean;
	unit: UnitOverview;
	user_id: number;
}

export type ProjectDetail = ProjectOverview & {
	unit_id: number;
	submitted_grade: number;
	portfolio_files: unknown[];
	compile_portfolio: boolean;
	uses_draft_learning_summary: boolean;
	tasks: Task[];
	tutorial_enrolments: unknown[];
	groups: unknown[];
	task_outcome_alignments: unknown[];
}

export type UnitOverview = {
	id: number;
	code: string;
	name: string;
	start_date: string;
	end_date: string;
	my_role: string;
	teaching_period_id: number;
	active: boolean;
}

export type UnitDetail = UnitOverview & {
	description: string;
	main_convenor_id: number;
	assessment_enabled: boolean;
	allow_student_extension_requests: boolean;
	allow_student_change_tutorial: boolean;
	ilos: LearningOutcome[];
	tutorials: unknown[];
	tutorial_streams: unknown[];
	task_definitions: TaskDefinition[];
	task_outcome_alignments: unknown[];
	staff: unknown[];
	group_sets: unknown[];
	groups: unknown[];
}

export type LearningOutcome = {
	id: number;
	ilo_number: number;
	abbreviation: string;
	name: string;
	description: string;
}

// eslint-disable-next-line max-len
export type TaskStatus = 'not_started' | 'ready_for_feedback' | 'complete' | 'fix_and_resubmit' | 'feedback_exceeded' | 'discuss' | 'time_exceeded' | 'working_on_it' | 'need_help';

type TaskCommon = {
	id: number;
	due_date: string;
}

export type Task = TaskCommon & {
	task_definition_id: number;
	submission_date: string;
	completion_date: string;
	extensions: number;
	times_assessed: number;
	quality_pts: number;
	include_in_portfolio: boolean;
	pct_similar: number;
	similar_to_count: number;
	similar_to_dismissed_count: number;
	num_new_comments: number;
	status: TaskStatus
}

export type TaskDefinition = TaskCommon & {
	abbreviation: string;
	name: string;
	description: string;
	weighting: number;
	target_grade: number;
	start_date: string;
	target_date: string;
	upload_requirements: unknown[];
	tutorial_stream_abbr: string;
	plagiarism_checks: unknown[];
	plagiarism_report_url: unknown;
	restrict_status_updates: boolean;
	group_set_id: number | null;
	has_task_sheet: boolean;
	has_task_resources: boolean;
	is_graded: boolean;
	max_quality_pts: number;
	overseer_image_id: unknown;
	assessment_enabled: boolean;
}
// end of data types for OnTrack API data responses
