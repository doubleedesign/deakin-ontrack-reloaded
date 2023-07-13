import { ServerContext, Subject } from '../types';
import { ProjectOverview } from '../datasources/OnTrack/types';
import { GraphQLError } from 'graphql/error';
import chalk from 'chalk';

export const currentSubjectsResolver = {
	currentSubjects: async (_: any, args: any, context: ServerContext): Promise<Subject[]> => {
		try {
			const projects: ProjectOverview[] = await context.datasources.onTrack.getCurrentProjects();
			if(projects) {
				return await Promise.all(projects.map(async (item: ProjectOverview) => {
					const project = await context.datasources.onTrack.getProjectDetails(item.id);
					const unit = await context.datasources.onTrack.getUnitDetails(item.unit.id);

					return {
						projectId: item.id,
						unitId: item.unit.id,
						unitCode: unit.code,
						name: unit.name,
						targetGrade: project.target_grade
					};
				}));
			}
			else {
				throw new GraphQLError('No projects found', { extensions: {
					code: 404,
					stackTrace: ''
				} });
			}
		}
		catch (error) {
			console.error(chalk.red(error.message));
			throw new GraphQLError(error.message);
		}
	}
};
