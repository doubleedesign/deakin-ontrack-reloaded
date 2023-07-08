import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import chalk from 'chalk';
import { Ontrack } from './datasources/OnTrack/ontrack';
import { typeDefs } from './schema';
import { getCurrentSubjectsResolver } from './resolvers/currentSubjects';
import { getUpcomingAssignmentsResolver } from './resolvers/upcomingAssignments';
import { getAssignmentsForSubjectResolver } from './resolvers/assignmentsForSubject';

const graphQLServer = new ApolloServer({
	typeDefs,
	resolvers: {
		Query: {
			...getCurrentSubjectsResolver,
			...getUpcomingAssignmentsResolver,
			...getAssignmentsForSubjectResolver
		}
	}
});

const server = await startStandaloneServer(graphQLServer, {
	listen: { port: 5000 },
	context: async ({ req, res }) => {
		return ({
			datasources: {
				onTrack: new Ontrack(<string>req.headers.username, <string>req.headers['auth-token'])
			}
		});
	},
});

console.log(chalk.magenta(`🚀 GraphQL server ready at: ${server.url}`));
