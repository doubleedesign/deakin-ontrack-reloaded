import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import chalk from 'chalk';
import { Ontrack } from './datasources/OnTrack/ontrack';
import { typeDefs } from './schema';
import { currentSubjectsResolver } from './resolvers/currentSubjects';
import { allUpcomingAssignmentsResolver } from './resolvers/upcomingAssignments';
import { assignmentsForSubjectResolver } from './resolvers/assignmentsForSubject';
import { DeakinSync } from './datasources/DeakinSync/deakinsync';

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

function startServer() {
	let otURL = 'https://ontrack.deakin.edu.au';
	const dsURL = 'https://bff-sync.sync.deakin.edu.au';
	if(process.env.NODE_ENV.trim() == 'development') {
		otURL = 'http://localhost:6001';
		// TODO: Mock DeakinSync
	}

	startStandaloneServer(graphQLServer, {
		listen: { port: 5000 },
		context: async ({ req, res }) => {
			return ({
				datasources: {
					onTrack: new Ontrack(<string>req.headers.username, <string>req.headers['auth-token'], otURL),
					deakinSync: new DeakinSync(<string>req.headers.authorization, dsURL)
				}
			});
		},
	}).then((server) => {
		console.log(chalk.magenta(`🚀 GraphQL server ready at: ${server.url}`));
	});
}

startServer();
