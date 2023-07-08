import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import chalk from 'chalk';
import { Ontrack } from './datasources/OnTrack/ontrack';
import { typeDefs } from './schema';
import { currentSubjectsResolver } from './resolvers/currentSubjects';
import { allUpcomingAssignmentsResolver } from './resolvers/upcomingAssignments';
import { assignmentsForSubjectResolver } from './resolvers/assignmentsForSubject';

const graphQLServer = new ApolloServer({
	typeDefs,
	resolvers: {
		Query: {
			...currentSubjectsResolver,
			...allUpcomingAssignmentsResolver,
			...assignmentsForSubjectResolver
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
