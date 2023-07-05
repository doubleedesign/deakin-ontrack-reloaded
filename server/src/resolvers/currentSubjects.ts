import { ServerContext, Subject } from '../types';
import { ProjectOverview } from '../datasources/OnTrack/types';
import { GraphQLError } from 'graphql/error';

export const getCurrentSubjectsResolver = {
	Query: {
		getCurrentSubjects: async(_: any, args: any, context: ServerContext): Promise<Subject[]> => {
			try {
				const projects: ProjectOverview[] = await context.datasources.onTrack.getProjects();

				const current = projects.filter((unit: ProjectOverview) => {
					return new Date(unit.unit.end_date) > new Date();
				}).map((unit: ProjectOverview) => unit.unit);

				return undefined; // TODO: Finish this
			}
			catch(error) {
				throw new GraphQLError(error.message);
			}
		}
	}
};
