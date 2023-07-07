import { ServerContext, Subject } from '../types';
import { ProjectOverview } from '../datasources/OnTrack/types';
import { GraphQLError } from 'graphql/error';
import chalk from 'chalk';

export const getCurrentSubjectsResolver = {
	getCurrentSubjects: async (_: any, args: any, context: ServerContext): Promise<Subject[]> => {
		try {
			const projects: ProjectOverview[] = await context.datasources.onTrack.getCurrentProjects();

			const current: ProjectOverview[] = projects.filter((item: ProjectOverview) => {
				return new Date(item.unit.end_date) > new Date();
			});

			return await Promise.all(current.map(async (item: ProjectOverview) => {
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
		catch (error) {
			console.error(chalk.red(error.message));
			throw new GraphQLError(error.message);
		}
	}
};
