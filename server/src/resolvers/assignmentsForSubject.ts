import { Assignment, ServerContext } from '../types';
import { ProjectDetail, UnitDetail, Task, TaskDefinition } from '../datasources/OnTrack/types';
import { GraphQLError } from 'graphql/error';
import pick from 'lodash/pick';
import chalk from 'chalk';
import { BrightspaceAssignment } from '../datasources/CloudDeakin/types';

export const assignmentsForSubjectResolver = {
	allAssignmentsForSubject: async (_: any, args: any, context: ServerContext): Promise<Assignment[]> => {
		try {
			const cloudAssignments: BrightspaceAssignment[] = await context.datasources.cloudDeakin.getAssignmentsForUnit(args.projectId);
			if(cloudAssignments) {
				return cloudAssignments.map((item: BrightspaceAssignment) => {
					return {
						unitId: args.unitId,
						projectId: args.projectId,
						id: item.Id,
						type: 'CloudDeakin',
						name: item.Name,
						abbreviation: undefined,
						description: undefined,
						status: undefined, // TODO
						due_date: item.DueDate,
						target_date: item.DueDate,
						submission_date: undefined, // TODO
						completion_date: undefined, // TODO
						maxPoints: item.Assessment.ScoreDenominator,
						awardedPoints: undefined, // TODO if possible
						weighting: undefined,
						is_graded: true
					};
				});
			}

			const projectDetails: ProjectDetail = await context.datasources.onTrack.getProjectDetails(args.projectId);
			if(projectDetails) {
				const unitDetails: UnitDetail = await context.datasources.onTrack.getUnitDetails(args.unitId);

				return projectDetails.tasks.map((task: Task) => {
					const taskDef: TaskDefinition = unitDetails.task_definitions.find((taskDef: TaskDefinition) => {
						return taskDef.id === task.task_definition_id;
					});

					return {
						unitId: args.unitId,
						projectId: args.projectId,
						...pick(task, ['status', 'submission_date', 'completion_date']),
						...pick(taskDef, ['id', 'due_date', 'abbreviation', 'name', 'description', 'target_date', 'weighting', 'is_graded']),
						maxPoints: taskDef.max_quality_pts,
						awardedPoints: task.quality_pts
					};
				});
			}
		}
		catch (error) {
			console.error(chalk.red(error.message));
			console.log(error.extensions);
			throw new GraphQLError(error.message, {
				extensions: {
					code: error.extensions.response.status,
					url: error.extensions.response.url,
					stacktrace: `${error.extensions.response.url} in ./server/src/resolvers/assignmentsForSubject.ts`
				}
			});
		}
	}
};
