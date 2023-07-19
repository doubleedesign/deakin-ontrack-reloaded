import { RESTDataSource } from '@apollo/datasource-rest';
import { BrightspaceAssignment } from './types';

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
		return await this.get(`/d2l/api/le/1.45/${id}/dropbox/folders/`, this.options);
	}
}
