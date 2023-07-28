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


const app = express();
const httpServer = http.createServer(app);
const graphQLServer = new ApolloServer({
	typeDefs,
	resolvers: {
		Query: {
			...persistentCacheResolver,
			...currentSubjectsResolver,
			...assignmentsForSubjectResolver
		}
	},
});

async function startServer() {
	let otURL = 'https://ontrack.deakin.edu.au';
	const dsURL = 'https://bff-sync.sync.deakin.edu.au';
	const cdURL = 'https://d2l.deakin.edu.au';
	if (process.env.NODE_ENV.trim() == 'development') {
		otURL = 'http://localhost:6001';
		// TODO: Mock DeakinSync and CloudDeakin
	}

	await graphQLServer.start();

	app.use('/graphql', cors<cors.CorsRequest>(), bodyParser.json({ limit: '50mb' }),
		expressMiddleware(graphQLServer, {
			context: async ({ req, res }) => {
				return ({
					datasources: {
						onTrack: new Ontrack(<string>req.headers.username, <string>req.headers.ontrack, otURL),
						deakinSync: new DeakinSync(<string>req.headers.deakinsync, dsURL),
						cloudDeakin: new CloudDeakin(<string>req.headers.clouddeakin, cdURL)
					}
				});
			},
		})
	);

	app.post('/typecheck', (req, res) => {
		res.send('TODO');
	});

	await new Promise<void>((resolve) => httpServer.listen({ port: 5000 }, resolve));

	console.log(chalk.yellow('================================================='));
	console.log(chalk.magenta('🚀 GraphQL server ready at: http://localhost:5000/graphql'));
	console.log(chalk.magenta('➕  REST endpoints available:'));
	listEndpoints(app).map(endpoint => console.log(chalk.cyan(`   ${endpoint.path} \t(${endpoint.methods})`)));
	console.log(chalk.yellow('================================================='));
}

await startServer();
