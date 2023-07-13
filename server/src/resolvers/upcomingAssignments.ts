import { Assignment, ServerContext } from '../types';
import { GraphQLError } from 'graphql/error';
import { ProjectOverview, Task, TaskDefinition } from '../datasources/OnTrack/types';
import chalk from 'chalk';
import pick from 'lodash/pick';
import flattenDeep from 'lodash/flattenDeep';

export const allUpcomingAssignmentsResolver = {
	allUpcomingAssignments: async (_: any, args: any, context: ServerContext): Promise<Assignment[]> => {
		try {
			const projects: ProjectOverview[] = await context.datasources.onTrack.getCurrentProjects();
			const ids = projects.map(project => {
				return {
					projectId: project.id,
					unitId: project.unit.id
				};
			});

			const assignments = await Promise.all(ids.map(async ({ projectId, unitId }) => {
				const [projectDetails, unitDetails] = await Promise.all([
					context.datasources.onTrack.getProjectDetails(projectId),
					context.datasources.onTrack.getUnitDetails(unitId)
				]);

				return projectDetails.tasks.map((task: Task) => {
					const taskDef: TaskDefinition = unitDetails.task_definitions.find((taskDef: TaskDefinition) => {
						return taskDef.id === task.task_definition_id;
					});

					return {
						unitId: unitId,
						projectId: projectId,
						...pick(task, ['status', 'submission_date', 'completion_date']),
						...pick(taskDef, ['id', 'due_date', 'abbreviation', 'name', 'description', 'target_date', 'weighting', 'is_graded']),
						maxPoints: taskDef.max_quality_pts,
						awardedPoints: task.quality_pts
					};
				});
			}));

			return flattenDeep(assignments).filter((assignment: Assignment) => {
				return new Date(assignment.due_date) > new Date();
			});
		}
		catch (error) {
			console.error(chalk.red(error.message));
			throw new GraphQLError(error.message);
		}
	}
};
