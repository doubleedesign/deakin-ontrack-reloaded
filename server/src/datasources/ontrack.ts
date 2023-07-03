import { RESTDataSource } from '@apollo/datasource-rest';
import { RawUnit } from 'src/types';

export class Ontrack extends RESTDataSource {
	private readonly username: string;
	private readonly token: string;

	constructor(username: string, token: string) {
		super();
		this.baseURL = 'https://ontrack.deakin.edu.au';
		this.username = username;
		this.token = token;
	}

	public async getCurrentUnits(): Promise<RawUnit[]> {
		return await this.get('/api/projects', {
			headers: {
				'Auth-Token': this.token,
				'Username': this.username
			}
		});
	}
}
