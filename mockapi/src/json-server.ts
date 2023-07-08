import require from 'require-from-esm';
const jsonServer = require('json-server');
import { db } from './data.ts';
import chalk from 'chalk';

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const port = 6001;

server.use(middlewares);

server.get('/api/projects', (req, res) => {
	res.json(db.overviews);
});

server.get('/api/projects/:id', (req, res) => {
	res.json(db.projects.find(project => project.id === req.params.id));
});

server.get('/api/units/:id', (req, res) => {
	res.json(db.units);
});

server.listen(port, () => {
	console.log(chalk.magenta('------------------------------------'));
	console.log(chalk.magenta(`Mock REST API server is running at http://localhost:${port}`));
	console.log('Available endpoints:');
	console.log('-- /api/projects \t ProjectOverview of all your Projects');
	console.log('-- /api/projects/:id \t ProjectDetail of a Project by ID');
	console.log('-- /api/units/:id \t UnitDetail of a Unit by ID');
	console.log(chalk.magenta('------------------------------------'));
});
