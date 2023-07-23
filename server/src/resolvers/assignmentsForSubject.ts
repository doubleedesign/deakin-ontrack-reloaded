import { Assignment, ServerContext } from '../types';
import { ProjectDetail, UnitDetail, Task, TaskDefinition } from '../datasources/OnTrack/types';
import pick from 'lodash/pick';
import chalk from 'chalk';
import { BrightspaceAssignment } from '../datasources/CloudDeakin/types';

export const assignmentsForSubjectResolver = {
	allAssignmentsForSubject: async (_: any, args: any, context: ServerContext): Promise<Assignment[]> => {
		try {
			const onTrackUnits = await context.datasources.onTrack.getCurrentProjects();
			const isOnTrackUnit = onTrackUnits.find(item => item.id === args.projectId);

			if(isOnTrackUnit) {
				const projectDetails: ProjectDetail = await context.datasources.onTrack.getProjectDetails(args.projectId);
				if (projectDetails) {
					const unitDetails: UnitDetail = await context.datasources.onTrack.getUnitDetails(projectDetails.unit_id);

					return unitDetails.task_definitions.map((taskDef: TaskDefinition) => {
						const task = projectDetails.tasks.find(task => task.task_definition_id === taskDef.id);

						console.log(task);

						if(task) {
							return {
								unitId: projectDetails.unit_id,
								projectId: args.projectId,
								...pick(task, ['status', 'submission_date', 'completion_date']),
								...pick(taskDef, ['id', 'due_date', 'abbreviation', 'name', 'description', 'target_date', 'weighting', 'is_graded']),
								maxPoints: taskDef.max_quality_pts,
								awardedPoints: task.quality_pts
							};
						}
						else {
							return {
								unitId: projectDetails.unit_id,
								projectId: args.projectId,
								status: 'not_started',
								submission_date: undefined,
								completion_date: undefined,
								...pick(taskDef, ['id', 'due_date', 'abbreviation', 'name', 'description', 'target_date', 'weighting', 'is_graded']),
								maxPoints: taskDef.max_quality_pts,
								awardedPoints: 0
							};
						}
					});
				}
			}
			else {
				const cloudAssignments: BrightspaceAssignment[] = await context.datasources.cloudDeakin.getAssignmentsForUnit(args.projectId);
				if(cloudAssignments) {
					return cloudAssignments.map((item: BrightspaceAssignment) => {
						return {
							unitId: args.projectId,
							projectId: args.projectId,
							id: item.Id,
							type: 'CloudDeakin',
							name: item.Name,
							abbreviation: '',
							description: undefined,
							status: 'not_started', // TODO
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
			}
		}
		catch (error) {
			console.error(chalk.red(error.message));
			console.log(error.extensions);
			/*
			throw new GraphQLError(error.message, {
				extensions: {
					code: error.extensions.response.status,
					url: error.extensions.response.url,
					stacktrace: `${error.extensions.response.url} in ./server/src/resolvers/assignmentsForSubject.ts`
				}
			}); */
		}
	}
};
