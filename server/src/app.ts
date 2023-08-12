import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import chalk from 'chalk';
import { Ontrack } from './datasources/OnTrack/ontrack';
import { typeDefs } from './schema';
import { persistentCacheResolver } from './resolvers/persistentCache';
import { currentSubjectsResolver } from './resolvers/currentSubjects';
import { assignmentsForSubjectResolver } from './resolvers/assignmentsForSubject';
import { DeakinSync } from './datasources/DeakinSync/deakinsync';
import { CloudDeakin } from './datasources/CloudDeakin/clouddeakin';
import * as http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import listEndpoints from 'express-list-endpoints';
import router from './rest/endpoints.ts';
import { upcomingAssignmentsResolver } from './resolvers/upcomingAssignments.ts';
import { assignmentDetailResolver } from './resolvers/assignmentDetail.ts';


const app = express();
app.use(cors());
app.use('/', router);

const httpServer = http.createServer(app);
const graphQLServer = new ApolloServer({
	typeDefs,
	resolvers: {
		Query: {
			...persistentCacheResolver,
			...currentSubjectsResolver,
			...assignmentsForSubjectResolver,
			...upcomingAssignmentsResolver,
			...assignmentDetailResolver
		}
	},
});

async function startServer() {
	const otURL = 'https://ontrack.deakin.edu.au';
	let demoMode = false;
	const dsURL = 'https://bff-sync.sync.deakin.edu.au';
	const cdURL = 'https://d2l.deakin.edu.au';
	if (process.env.NODE_ENV.trim() == 'development' || process.env.NODE_ENV.trim() == 'test') {
		//otURL = 'http://localhost:6001'; // TODO: MockAPI
		// TODO: Mock DeakinSync and CloudDeakin
	}
	if(process.env.NODE_ENV.trim() == 'test') {
		demoMode = true; // TODO: Replace use of demo mode functions in datasource with full mock API for testing
	}

	await graphQLServer.start();

	app.use('/graphql', cors<cors.CorsRequest>(), bodyParser.json({ limit: '50mb' }),
		expressMiddleware(graphQLServer, {
			context: async ({ req, res }) => {
				return ({
					datasources: {
						onTrack: new Ontrack(<string>req.headers.username, <string>req.headers.ontrack, otURL, demoMode),
						deakinSync: new DeakinSync(<string>req.headers.deakinsync, dsURL, demoMode),
						cloudDeakin: new CloudDeakin(<string>req.headers.clouddeakin, cdURL, demoMode)
					}
				});
			},
		})
	);

	await new Promise<void>((resolve) => httpServer.listen({ port: 5000 }, resolve));

	console.log(chalk.yellow('================================================='));
	console.log(chalk.magenta('🚀 GraphQL server ready at: http://localhost:5000/graphql'));
	console.log(chalk.magenta('➕  REST endpoints available:'));
	listEndpoints(app).map(endpoint => console.log(chalk.cyan(`   ${endpoint.path} \t(${endpoint.methods})`)));
	console.log(chalk.yellow('================================================='));
}

await startServer();
