import { ServerContext, Subject } from '../types';
import { ProjectOverview } from '../datasources/OnTrack/types';
import { GraphQLError } from 'graphql/error';
import chalk from 'chalk';
import { CallistaUnit } from '../datasources/DeakinSync/types';

export const currentSubjectsResolver = {
	currentSubjects: async (_: any, args: any, context: ServerContext): Promise<Subject[]> => {
		try {
			const currentUnits: CallistaUnit[] = await context.datasources.deakinSync.getCurrentUnits();
			const onTrackProjects: ProjectOverview[] = await context.datasources.onTrack.getCurrentProjects();

			if(currentUnits || onTrackProjects) {
				const otItems: Subject[] = await Promise.all(onTrackProjects.map(async (item: ProjectOverview) => {
					const project = await context.datasources.onTrack.getProjectDetails(item.id);
					const unit = await context.datasources.onTrack.getUnitDetails(item.unit.id);

					return {
						projectId: item.id,
						unitId: item.unit.id,
						unitCode: unit.code,
						name: unit.name,
						targetGrade: project.target_grade,
						url: [`https://ontrack.deakin.edu.au/#/projects/${item.id}/dashboard/`]
					};
				}));

				const dsItems: Subject[] = currentUnits.map((item: CallistaUnit) => {
					// @ts-ignore
					const d2lid = item.url.split('/').at(-1) as number;
					return {
						projectId: d2lid,
						unitId: d2lid,
						unitCode: item.code,
						name: item.name,
						targetGrade: 3,
						url: [item.url]
					};
				});

				const items = [...otItems, ...dsItems];

				return items.sort((a, b) => a.unitCode.localeCompare(b.unitCode));
			}
			else {
				throw new GraphQLError('No projects found', { extensions: {
					code: 404,
					stacktrace: './server/src/resolvers/currentSubjects.ts'
				} });
			}
		}
		catch (error) {
			console.error(chalk.red(error.message));
			throw new GraphQLError(error.message);
		}
	}
};
