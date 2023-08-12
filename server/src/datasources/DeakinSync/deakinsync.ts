import { RESTDataSource } from '@apollo/datasource-rest';
import { CallistaUnit } from './types';
import fs from 'fs';

export class DeakinSync extends RESTDataSource {
	private readonly options: { headers: { Authorization: string } };
	private readonly demoMode: boolean;

	constructor(token: string, baseURL: string, demoMode: boolean) {
		super();
		this.options = {
			headers: {
				'Authorization': `${token}`
			}
		};
		this.baseURL = baseURL;
		this.demoMode = demoMode;
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
			catch {
				throw error;
			}
		}
	}

	public async getSelectedUnitsForDemo(): Promise<CallistaUnit[]> {
		try {
			const all = await this.get('/v1/units/all', this.options);
			const selected: CallistaUnit[] = [];
			all.deakinUnits.forEach(yearObject => {
				yearObject.teachingPeriods.forEach(period => {
					period.callistaUnits.forEach((unit: CallistaUnit) => {
						// checking credit points accounts for being enrolled twice, e.g. late withdrawal
						if(['ADD302', 'SIT217', 'SIT102', 'SIT331', 'SIT323', 'SIT192', 'SIT176'].includes(unit.code) && unit.creditPoints > 0) {
							selected.push(unit);
						}
					});
				});
			});

			fs.writeFileSync('./src/cache/demo-units.json', JSON.stringify(selected, null, 4), { flag: 'w' });

			return selected;
		}
		catch(error) {
			console.log(error);
			try {
				const cached = fs.readFileSync('./src/cache/demo-units.json');
				return JSON.parse(cached.toString());
			}
			catch {
				throw error;
			}
		}
	}

	public async getUnits(): Promise<CallistaUnit[]> {
		if(this.demoMode) {
			return this.getSelectedUnitsForDemo();
		}

		return this.getCurrentUnits();
	}
}
