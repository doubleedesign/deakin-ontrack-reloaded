import { Assignment, ServerContext } from '../types.ts';
import { ProjectDetail, TaskDefinition, TaskStatus, UnitDetail } from '../datasources/OnTrack/types.ts';
import { BrightspaceAssignment, BrightspaceSubmission } from '../datasources/CloudDeakin/types.ts';
import pick from 'lodash/pick';
import chalk from 'chalk';

export const commonResolverFunctions = {
	assignmentsForSubject: async (_: any, args: any, context: ServerContext): Promise<Assignment[]> => {
		try {
			const onTrackUnits = await context.datasources.onTrack.getProjects();
			const isOnTrackUnit = onTrackUnits.find(item => item.id === args.projectId);

			if(isOnTrackUnit) {
				const projectDetails: ProjectDetail = await context.datasources.onTrack.getProjectDetails(args.projectId);
				if (projectDetails) {
					const unitDetails: UnitDetail = await context.datasources.onTrack.getUnitDetails(projectDetails.unit_id);

					return unitDetails.task_definitions.map((taskDef: TaskDefinition) => {
						const task = projectDetails.tasks.find(task => task.task_definition_id === taskDef.id);
						let myTargetDate = taskDef.target_date;

						if(task) {
							if(task.extensions > 0) {
								myTargetDate = task.due_date;
							}

							return {
								unitId: projectDetails.unit_id,
								projectId: args.projectId,
								target_date: myTargetDate,
								...pick(task, ['status', 'submission_date', 'completion_date']),
								...pick(taskDef, ['id', 'due_date', 'abbreviation', 'name', 'description', 'target_grade', 'weighting', 'is_graded']),
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
								...pick(taskDef, ['id', 'due_date', 'abbreviation', 'name', 'description', 'target_date', 'target_grade', 'weighting', 'is_graded']),
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
					return await Promise.all(cloudAssignments.map(async (item: BrightspaceAssignment): Promise<Assignment> => {
						let status: TaskStatus = 'not_started';
						let lastSubmission: BrightspaceSubmission = undefined;
						// eslint-disable-next-line max-len
						const submissions: BrightspaceSubmission[] = await context.datasources.cloudDeakin.getAssignmentSubmission(args.projectId, item.Id);
						if(submissions) {
							lastSubmission = submissions[submissions.length - 1];
							if (lastSubmission) {
								if (lastSubmission.Feedback) {
									status = 'complete';
								}
								else {
									status = 'ready_for_feedback';
								}
							}
						}

						return {
							unitId: args.projectId,
							projectId: args.projectId,
							id: item.Id,
							type: 'CloudDeakin',
							name: item.Name,
							abbreviation: '',
							description: undefined,
							status: status,
							due_date: item.DueDate,
							target_date: item.DueDate,
							target_grade: 0, // Assume all CloudDeakin assignments are required for a pass
							submission_date: lastSubmission ? lastSubmission.Submissions[0].SubmissionDate : undefined,
							completion_date: status === 'complete' ? lastSubmission?.CompletionDate : undefined,
							maxPoints: item.Assessment.ScoreDenominator,
							awardedPoints: lastSubmission?.Feedback ? lastSubmission?.Feedback?.Score : undefined,
							weighting: undefined,
							is_graded: true
						};
					}));
				}
			}
		}
		catch (error) {
			console.log(error);
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
