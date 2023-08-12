import { RESTDataSource } from '@apollo/datasource-rest';
import { ProjectDetail, ProjectOverview, UnitDetail } from './types';
import fs from 'fs';
import { GraphQLError } from 'graphql/error';
import axios from 'axios';
import chalk from 'chalk';

/**
 * Each unit enrolment you have is for some reason called a Project in the OnTrack API.
 * Within each Project is a Unit, which has a separate ID from the Project.
 * The details about your work in the unit are contained within the Project details,
 * whereas the Unit details contain the definition of the unit itself.
 */
export class Ontrack extends RESTDataSource {
	private readonly options: { headers: { Username: string; 'Auth-Token': string; } };
	private readonly demoMode: boolean;

	constructor(username: string, token: string, baseURL: string, demoMode: boolean) {
		super();
		this.options = {
			headers: {
				'Auth-Token': token,
				'Username': username,
			}
		};
		this.baseURL = baseURL;
		this.demoMode = demoMode;
	}

	/**
	 * Gets all of your enrolments, called "Projects" in the OnTrack API
	 */
	public async getAllProjects(): Promise<ProjectOverview[]> {
		try {
			const result = await this.get('/api/projects', this.options);
			fs.writeFileSync('./src/cache/projects-all.json', JSON.stringify(result, null, 4), { flag: 'w' });

			return result;
		}
		catch(error) {
			try {
				const cached = fs.readFileSync('./src/cache/projects-all.json');
				return JSON.parse(cached.toString());
			}
			catch {
				throw error;
			}
		}
	}

	/**
	 * Get just your current enrolments, called "Projects" in the OnTrack API
	 */
	public async getCurrentProjects(): Promise<ProjectOverview[]> {
		try {
			const projects = await this.get('/api/projects/?include_inactive=false', this.options);

			// At the time of writing,
			// the include_inactive parameter doesn't actually work like I expect, it returns all projects regardless
			// (the front-end code in OnTrack just outputs an empty component for inactive units)
			// so I need to do my own filtering
			const filtered = projects.filter(project => {
				return new Date(project.unit.end_date) > new Date();
			});

			fs.writeFileSync('./src/cache/projects-current.json', JSON.stringify(filtered, null, 4), { flag: 'w' });

			return filtered;
		}
		catch(error) {
			try {
				const cached = fs.readFileSync('./src/cache/projects-current.json');
				return JSON.parse(cached.toString());
			}
			catch {
				throw error;
			}
		}
	}

	/**
	 * A selection of units I have undertaken/am undertaking,
	 * to use for demo/testing purposes (eventually this should be replaced with a full mock API)
	 */
	public async getSelectedProjectsForDemo(): Promise<ProjectOverview[]> {
		try {
			const projects = await this.get('/api/projects', this.options);

			const filtered = projects.filter(project => {
				return [
					76205, // SIT217
					63174, // SIT331
					57704, // SIT323
					58695, // SIT102
					47250, // SIT192
				].includes(project.id);
			});

			fs.writeFileSync('./src/cache/projects-demo.json', JSON.stringify(filtered, null, 4), { flag: 'w' });

			return filtered;
		}
		catch(error) {
			try {
				const cached = fs.readFileSync('./src/cache/projects-demo.json');
				return JSON.parse(cached.toString());
			}
			catch {
				throw error;
			}
		}
	}


	public async getProjects(): Promise<ProjectOverview[]> {
		if(this.demoMode) {
			return this.getSelectedProjectsForDemo();
		}

		return this.getCurrentProjects();
	}

	/**
	 * Gets the details of your work in a particular unit by its Project ID,
	 * such as task attempts and their status
	 * @param id
	 */
	public async getProjectDetails(id: number): Promise<ProjectDetail> {
		try {
			const result = await this.get(`/api/projects/${id}`, this.options);
			const file = fs.readFileSync('./src/cache/project-details.json');
			const cached = JSON.parse(file.toString());
			if(!cached && result) {
				const updated = {
					[id]: result
				};
				fs.writeFileSync('./src/cache/project-details.json', JSON.stringify(updated, null, 4), { flag: 'w' });
			}
			else {
				const updated = cached;
				updated[id] = result;
				fs.writeFileSync('./src/cache/project-details.json', JSON.stringify(updated, null, 4), { flag: 'w' });
			}

			return result;
		}
		catch(error) {
			const file = fs.readFileSync('./src/cache/project-details.json');
			const cached = JSON.parse(file.toString());

			if(cached[id]) {
				return cached[id];
			}
			else {
				throw new GraphQLError('Attempted to load from a cached file, but the requested data was not in it.', {
					extensions: {
						code: 404,
						stacktrace: './server/src/datasources/CloudDeakin/ontrack.ts'
					}
				});
			}
		}
	}

	/**
	 * Get the details of the Unit itself, e.g., learning outcomes and task definitions
	 * @param id
	 */
	public async getUnitDetails(id: number): Promise<UnitDetail> {
		try {
			const result = await this.get(`/api/units/${id}`, this.options);
			const file = fs.readFileSync('./src/cache/unit-details.json');
			const cached = JSON.parse(file.toString());

			if(cached && result) {
				cached[id] = result;
				fs.writeFileSync('./src/cache/unit-details.json', JSON.stringify(cached, null, 4), { flag: 'w' });
			}

			return result;
		}
		catch(error) {
			const file = fs.readFileSync('./src/cache/unit-details.json');
			const cached = JSON.parse(file.toString());

			if(cached[id]) {
				return cached[id];
			}
			else {
				throw new GraphQLError('Attempted to load from a cached file, but the requested data was not in it.', {
					extensions: {
						code: 404,
						stacktrace: './server/src/datasources/OnTrack/ontrack.ts'
					}
				});
			}
		}
	}


	/**
	 * Fetch file, save it to the cache folder, and return the URL of the saved/cached file
	 * @param unitId
	 * @param taskDefId
	 * @param sourceFile
	 * @param outputFile
	 * @param format
	 */
	public async getTaskDefFile(unitId: number, taskDefId: number, sourceFile: string, outputFile: string, format: string): Promise<string> {
		const path = `${this.baseURL}/api/units/${unitId}/task_definitions/${taskDefId}/${sourceFile}`;
		const saved = `./src/cache/files/${outputFile}`;
		const output = `http://localhost:5000/files/${outputFile}`;
		try {
			const result = await axios.get(path, {
				headers: {
					'Auth-Token': this.options.headers['Auth-Token'],
					'Username': this.options.headers['Username'],
					Accept: format,
					'Content-Type': format
				},
				responseType: 'stream'
			});
			if(result.status === 200) {
				result.data.pipe(fs.createWriteStream(saved));

				return output;
			}
		}
		catch(error) {
			console.warn(chalk.yellow(error.message));
			console.warn(chalk.yellow('Trying to load from cache...'));
			if(fs.existsSync(saved)) {
				const cached = fs.readFileSync(saved);
				if(cached) {
					console.log(chalk.green('Loaded file from cache'));
					return output;
				}
			}
			else {
				throw new GraphQLError('Attempted to load a cached file, but it wasn\'t there.', {
					extensions: {
						code: 404,
						stacktrace: './server/src/datasources/OnTrack/ontrack.ts'
					}
				});
			}
		}
	}
}
