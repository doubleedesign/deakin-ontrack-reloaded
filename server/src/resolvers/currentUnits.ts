import { RawUnit, ServerContext, Unit } from '../types';

export const getCurrentUnitsResolver = {
	Query: {
		getCurrentUnits: async(_: any, args: any, context: ServerContext): Promise<Unit[]> => {
			try {
				const units = await context.datasources.onTrack.getCurrentUnits();

				return units.filter((unit: RawUnit) => {
					return new Date(unit.unit.end_date) > new Date();
				}).map((unit: RawUnit) => unit.unit);
			}
			catch(error) {
				throw new Error(error.message);
			}
		}
	}
};
