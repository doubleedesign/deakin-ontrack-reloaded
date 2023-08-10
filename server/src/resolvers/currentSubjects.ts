import { ServerContext, Subject } from '../types';
import { ProjectOverview } from '../datasources/OnTrack/types';
import { GraphQLError } from 'graphql/error';
import chalk from 'chalk';
import { CallistaUnit } from '../datasources/DeakinSync/types';
import pick from 'lodash/pick';

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
						startDate: item.unit.start_date,
						endDate: item.unit.end_date,
						isOnTrackUnit: true,
						urls: [
							{ label: 'OnTrack', url: `https://ontrack.deakin.edu.au/#/projects/${item.id}/dashboard/` }
						]
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
						startDate: undefined,
						endDate: undefined,
						isOnTrackUnit: false,
						urls: [
							{ label: 'CloudDeakin', url: item.url }
						]
					};
				});

				// Some, if not all, units will exist in both locations; they need to be consolidated into one object without duplicates.
				// All units should be in DeakinSync, whereas some may not be in OnTrack - that's why this adds OT data to DS data, not the other way around
				const consolidatedResults = dsItems.map((dsItem: Subject) => {
					// Match by name because if the unit is combined undergrad/postgrad, the codes won't match between the two systems
					const otItem = otItems.find(item => item.name === dsItem.name);
					if(!otItem) {
						return dsItem;
					}

					return {
						...pick(dsItem, ['unitCode']),
						...pick(otItem, ['projectId', 'unitId', 'name', 'targetGrade', 'startDate', 'endDate', 'isOnTrackUnit']),
						urls: dsItem.urls.concat(otItem.urls)
					};
				});

				return consolidatedResults.sort((a, b) => a.unitCode.localeCompare(b.unitCode));
			}
			else {
				throw new GraphQLError('No projects or units found', { extensions: {
					code: 404,
					stacktrace: './server/src/resolvers/currentSubjects.ts'
				} });
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
					stacktrace: `${error.extensions.response.url} in ./server/src/resolvers/currentSubjects.ts`
				}
			}); */
		}
	}
};
