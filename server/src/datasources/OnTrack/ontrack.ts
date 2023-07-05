import { RESTDataSource } from '@apollo/datasource-rest';
import { ProjectDetail, ProjectOverview, UnitDetail } from './types';

/**
 * Each unit enrolment you have is for some reason called a Project in the OnTrack API.
 * Within each Project is a Unit, which has a separate ID from the Project.
 * The details about your work in the unit are contained within the Project details,
 * whereas the Unit details contain the definition of the unit itself.
 */
export class Ontrack extends RESTDataSource {
	private readonly options: { headers: { Username: string; 'Auth-Token': string } };

	constructor(username: string, token: string) {
		super();
		this.baseURL = 'https://ontrack.deakin.edu.au';
		this.options = {
			headers: {
				'Auth-Token': token,
				'Username': username
			}
		};
	}

	/**
	 * Gets all of your enrolments, called "Projects" in the OnTrack API
	 */
	public async getProjects(): Promise<ProjectOverview[]> {
		return await this.get('/api/projects', this.options);
	}

	/**
	 * Gets the details of your work in a particular unit by its Project ID,
	 * such as task attempts and their status
	 * @param id
	 */
	public async getProjectDetails(id: number): Promise<ProjectDetail> {
		return await this.get(`/api/projects/${id}`, this.options);
	}

	/**
	 * Get the details of the Unit itself, e.g., learning outcomes and task definitions
	 * @param id
	 */
	public async getUnitDetails(id: number): Promise<UnitDetail> {
		return await this.get(`/api/units/${id}`, this.options);
	}
}