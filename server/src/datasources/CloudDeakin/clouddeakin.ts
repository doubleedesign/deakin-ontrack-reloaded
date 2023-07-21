import { RESTDataSource } from '@apollo/datasource-rest';
import { BrightspaceAssignment } from './types';
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
			cached[id] = result;
			fs.writeFileSync('./src/cache/cloud-assignments.json', JSON.stringify(cached, null, 4), { flag: 'w' });

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
}
