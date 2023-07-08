import { Assignment, ServerContext } from '../types';
import { ProjectDetail, UnitDetail, Task, TaskDefinition } from '../datasources/OnTrack/types';
import { GraphQLError } from 'graphql/error';
import pick from 'lodash/pick';
import chalk from 'chalk';

export const assignmentsForSubjectResolver = {
	allAssignmentsForSubject: async (_: any, args: any, context: ServerContext): Promise<Assignment[]> => {
		try {
			const projectDetails: ProjectDetail = await context.datasources.onTrack.getProjectDetails(args.projectId);
			const unitDetails: UnitDetail = await context.datasources.onTrack.getUnitDetails(args.unitId);

			return projectDetails.tasks.map((task: Task) => {
				const taskDef: TaskDefinition = unitDetails.task_definitions.find((taskDef: TaskDefinition) => {
					return taskDef.id === task.task_definition_id;
				});

				return {
					unitId: args.unitId,
					projectId: args.projectId,
					...pick(task, ['id', 'due_date', 'status', 'submission_date', 'completion_date']),
					...pick(taskDef, ['abbreviation', 'name', 'description', 'target_date', 'weighting', 'is_graded']),
					maxPoints: taskDef.max_quality_pts,
					awardedPoints: task.quality_pts
				};
			});
		}
		catch (error) {
			console.error(chalk.red(error.message));
			throw new GraphQLError(error.message);
		}
	}
};
