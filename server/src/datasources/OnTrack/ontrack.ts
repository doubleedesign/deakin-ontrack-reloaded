import { RESTDataSource } from '@apollo/datasource-rest';
import { ProjectDetail, ProjectOverview, UnitDetail } from './types';
import fs from 'fs';
import { GraphQLError } from 'graphql/error';

/**
 * Each unit enrolment you have is for some reason called a Project in the OnTrack API.
 * Within each Project is a Unit, which has a separate ID from the Project.
 * The details about your work in the unit are contained within the Project details,
 * whereas the Unit details contain the definition of the unit itself.
 */
export class Ontrack extends RESTDataSource {
	private readonly options: { headers: { Username: string; 'Auth-Token': string } };

	constructor(username: string, token: string, baseURL: string) {
		super();
		this.options = {
			headers: {
				'Auth-Token': token,
				'Username': username
			}
		};
		this.baseURL = baseURL;
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
			// the include_inactive parameter doesn't actually work, it returns all projects regardless
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
	 * Gets the details of your work in a particular unit by its Project ID,
	 * such as task attempts and their status
	 * @param id
	 */
	public async getProjectDetails(id: number): Promise<ProjectDetail> {
		try {
			const result = await this.get(`/api/projects/${id}`, this.options);
			const file = fs.readFileSync('./src/cache/project-details.json');
			const cached = JSON.parse(file.toString());
			if(!cached) {
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
			cached[id] = result;
			fs.writeFileSync('./src/cache/unit-details.json', JSON.stringify(cached, null, 4), { flag: 'w' });

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
						stacktrace: './server/src/datasources/CloudDeakin/ontrack.ts'
					}
				});
			}
		}
	}
}
