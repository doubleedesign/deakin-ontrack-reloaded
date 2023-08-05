import { Assignment, ServerContext } from '../types';
import { commonResolverFunctions } from './_shared.ts';

export const assignmentsForSubjectResolver = {
	allAssignmentsForSubject: async (_: any, args: any, context: ServerContext): Promise<Assignment[]> => {
		return commonResolverFunctions.assignmentsForSubject(_, { projectId: args.projectId }, context);
	}
};
