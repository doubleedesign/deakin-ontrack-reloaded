import { PersistentCacheStatus, ServerContext } from '../types';
import fs from 'fs';

export const persistentCacheResolver = {
	persistentCacheStatus: async (_: any, args: any, context: ServerContext): Promise<PersistentCacheStatus> => {
		return {
			DeakinSync: fs.statSync('./src/cache/enrolled-units.json').mtime || null,
			CloudDeakin: null,
			OnTrack: null
		};
	}
};
