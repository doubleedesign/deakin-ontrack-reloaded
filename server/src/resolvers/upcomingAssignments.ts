import { Assignment, ServerContext } from '../types';
import { ProjectOverview } from '../datasources/OnTrack/types';
import { commonResolverFunctions } from './_shared.ts';
import { CallistaUnit } from '../datasources/DeakinSync/types.ts';
import flatten from 'lodash/flatten';
import { isWithinInterval, add, isBefore } from 'date-fns';
import chalk from 'chalk';

export const upcomingAssignmentsResolver = {
	upcomingAssignments: async (_: any, args: any, context: ServerContext): Promise<Assignment[]> => {
		try {
			const allUnits: CallistaUnit[] = await context.datasources.deakinSync.getCurrentUnits();
			const onTrackUnits: ProjectOverview[] = await context.datasources.onTrack.getCurrentProjects();

			const all: Assignment[] = flatten(await Promise.all(allUnits.map((item: CallistaUnit) => {
				const onTrackProject: ProjectOverview = onTrackUnits.find(subItem => {
					return subItem.unit.code.split('/')[0] === item.code;
				});
				if(onTrackProject) {
					return commonResolverFunctions.assignmentsForSubject(_, { projectId: onTrackProject.id }, context);
				}
				else {
					const d2lid = item.url.split('/').at(-1);
					return commonResolverFunctions.assignmentsForSubject(_, { projectId: d2lid }, context);
				}
			})));

			const incomplete = all.filter((assignment: Assignment) => !['complete', 'ready_for_feedback'].includes(assignment.status));

			return incomplete.filter((assignment: Assignment) => {
				const today = new Date();
				const due = new Date(Date.parse(assignment.target_date));
				return isWithinInterval(due, {
					start: today,
					end: add(today, { weeks: args.weeks })
				}) || isBefore(due, today);
			}).sort((a, b) => {
				return Date.parse(a.target_date) - Date.parse(b.target_date);
			});
		}
		catch (error) {
			console.error(chalk.red(error.message));
			console.log(error.extensions);
			/*
			throw new GraphQLError(error.message, {
				extensions: {
					code: error.extensions.response.status,
					url: error.extensions.response.url,
					stacktrace: `${error.extensions.response.url} in ./server/src/resolvers/upcomingAssignments.ts`
				}
			}); */
		}
	}
};
