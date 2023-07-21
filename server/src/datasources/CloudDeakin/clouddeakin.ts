import { RESTDataSource } from '@apollo/datasource-rest';
import { BrightspaceAssignment } from './types';
import fs from 'fs';

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
			fs.writeFileSync(`./src/cache/${id}.json`, JSON.stringify(result, null, 4), { flag: 'w' });

			return result;
		}
		catch(error) {
			try {
				const cached = fs.readFileSync(`./src/cache/${id}.json`);
				return JSON.parse(cached.toString());
			}
			catch {
				throw error;
			}
		}
	}
}
