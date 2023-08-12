import { AssignmentDetail, ServerContext } from '../types.ts';
import { ProjectOverview, TaskDefinition, UnitDetail } from '../datasources/OnTrack/types.ts';
import chalk from 'chalk';

export const assignmentDetailResolver = {
	assignmentDetail: async (_: any, args: any, context: ServerContext): Promise<AssignmentDetail> => {
		try {
			const onTrackUnits: ProjectOverview[] = await context.datasources.onTrack.getProjects();
			const isOnTrackUnit: ProjectOverview = onTrackUnits.find(item => item.id === args.projectId);

			if (isOnTrackUnit) {
				const unitId: number = isOnTrackUnit.unit.id;
				const unitDetails: UnitDetail = await context.datasources.onTrack.getUnitDetails(unitId);
				const taskDef: TaskDefinition = unitDetails.task_definitions.find(def => def.id === args.taskDefId);

				return {
					isOnTrackUnit: true,
					taskSheetUrl: taskDef.has_task_sheet ?
						await context.datasources.onTrack.getTaskDefFile(unitId, args.taskDefId, 'task_pdf.json', `${unitDetails.code.split('/')[0]}-${taskDef.abbreviation}.pdf`, 'application/pdf')
						: undefined,
					taskResourcesUrl: taskDef.has_task_resources ?
						await context.datasources.onTrack.getTaskDefFile(unitId, args.taskDefId, 'task_resources.json', `${unitDetails.code.split('/')[0]}-${taskDef.abbreviation}.zip`, 'application/zip')
						: undefined,
				};
			}
			else {
				return {
					isOnTrackUnit: false,
					taskSheetUrl: undefined,
					taskResourcesUrl: undefined
				};
			}
		}
		catch(error) {
			console.error(chalk.red(error.message));
			console.log(error.extensions);
			/*
			throw new GraphQLError(error.message, {
				extensions: {
					code: error.extensions.response.status,
					url: error.extensions.response.url,
					stacktrace: `${error.extensions.response.url} in ./server/src/resolvers/assignmentDetails.ts`
				}
			}); */
		}
	}
};
