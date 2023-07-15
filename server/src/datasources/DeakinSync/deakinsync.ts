import { RESTDataSource } from '@apollo/datasource-rest';
import { CallistaUnit } from './types';

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
		const units = await this.get('/v1/units/current', this.options);

		return units.callistaUnits.filter(unit => unit.code !== 'Division of Student Life');
	}
}
