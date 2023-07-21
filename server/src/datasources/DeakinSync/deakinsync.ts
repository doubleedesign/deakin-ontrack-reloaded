import { RESTDataSource } from '@apollo/datasource-rest';
import { CallistaUnit } from './types';
import fs from 'fs';

export class DeakinSync extends RESTDataSource {
	private readonly options: { headers: { Authorization: string } };

	constructor(token: string, baseURL: string) {
		super();
		this.options = {
			headers: {
				'Authorization': `${token}`
			}
		};
		this.baseURL = baseURL;
	}

	public async getCurrentUnits(): Promise<CallistaUnit[]> {
		try {
			const units = await this.get('/v1/units/current', this.options);
			const filtered = units.callistaUnits.filter(unit => unit.code !== 'Division of Student Life');
			fs.writeFileSync('./src/cache/enrolled-units.json', JSON.stringify(filtered, null, 4), { flag: 'w' });

			return filtered;
		}
		catch(error) {
			try {
				const cached = fs.readFileSync('./src/cache/enrolled-units.json');
				return JSON.parse(cached.toString());
			}
			catch(e) {
				throw error;
			}
		}
	}
}
