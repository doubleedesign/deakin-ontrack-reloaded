import { RESTDataSource } from '@apollo/datasource-rest';
import { BrightspaceAssignment, BrightspaceSubmission } from './types';
import fs from 'fs';
import { GraphQLError } from 'graphql/error';

export class CloudDeakin extends RESTDataSource {
	private readonly options: { headers: { Authorization: string } };

	constructor(token: string, baseURL: string) {
		super();
		this.options = {
			headers: {
				'Authorization': `${token}`,
			}
		};
		this.baseURL = baseURL;
	}

	public async getAssignmentsForUnit(id: number): Promise<BrightspaceAssignment[]> {
		try {
			const result = await this.get(`/d2l/api/le/1.45/${id}/dropbox/folders/`, this.options);
			const file = fs.readFileSync('./src/cache/cloud-assignments.json');
			const cached = JSON.parse(file.toString());
			if(cached && result) {
				cached[id] = result;
				fs.writeFileSync('./src/cache/cloud-assignments.json', JSON.stringify(cached, null, 4), { flag: 'w' });
			}

			return result;
		}
		catch(error) {
			const file = fs.readFileSync('./src/cache/cloud-assignments.json');
			const cached = JSON.parse(file.toString());

			if(cached[id]) {
				return cached[id];
			}
			else {
				throw new GraphQLError('Attempted to load from a cached file, but the requested data was not in it.', {
					extensions: {
						code: 404,
						stacktrace: './server/src/datasources/CloudDeakin/clouddeakin.ts'
					}
				});
			}
		}
	}

	public async getAssignmentSubmission(unitId: number, assignmentId: number): Promise<BrightspaceSubmission[]> {
		try {
			const result = await this.get(`/d2l/api/le/1.45/${unitId}/dropbox/folders/${assignmentId}/submissions/`, this.options);
			const file = fs.readFileSync('./src/cache/cloud-submissions.json');
			const cached = JSON.parse(file.toString());
			if(cached && result) {
				cached[assignmentId] = result;
				fs.writeFileSync('./src/cache/cloud-submissions.json', JSON.stringify(cached, null, 4), { flag: 'w' });
			}

			return result;
		}
		catch (error) {
			const file = fs.readFileSync('./src/cache/cloud-submissions.json');
			const cached = JSON.parse(file.toString());

			if(cached[assignmentId]) {
				return cached[assignmentId];
			}
			else {
				return null;
			}
		}
	}
}
