import { GraphQLError } from 'graphql/error';
import { AuthResponse, DeakinCredential, MyCredentials, MyQueryContext, SystemName } from '../types.ts';

export const auth = {

	// Note: Each call should hit an endpoint that requires authentication but doesn't return much data, just to see if I can
	authenticateOne: async function(name: SystemName, url: string, headers: any): Promise<DeakinCredential> {
		const response = await fetch(url, {
			method: 'GET',
			headers: headers
		});

		if(response.status === 200) {
			return {
				systemName: name,
				username: headers.username || undefined,
				token: headers.Authorization || headers['Auth-Token']
			};
		}
		else {
			throw new GraphQLError(`${response.statusText} - ${name}`, {
				extensions: {
					code: response.status,
					statusText: response.statusText,
					systemName: name,
					stacktrace: './frontend/src/context/auth.ts'
				}
			});
		}
	},


	// TODO: Handle the mock API - only require auth if really accessing the real systems
	authenticateAll: async function (username: string, submittedOtToken: string, submittedDsToken: string, submittedCdToken: string): Promise<AuthResponse> {
		const errors: GraphQLError[] = [];
		const authenticated: DeakinCredential[] = [];
		const systemQty = 3;

		const trimmedOtToken = submittedOtToken.trim();
		// Make sure "Bearer" won't be included twice, and it doesn't matter if it's submitted with it or not
		const trimmedDsToken = submittedDsToken ? submittedDsToken.replace('Bearer', '').trim() : '';
		const trimmedCdToken = submittedCdToken ? submittedCdToken.replace('Bearer', '').trim() : '';

		try {
			const otResponse = await this.authenticateOne('OnTrack', 'https://ontrack.deakin.edu.au/api/unit_roles', {
				username: username,
				'Auth-Token': trimmedOtToken
			});

			authenticated.push(otResponse as DeakinCredential);
		}
		catch(error) {
			errors.push(error as GraphQLError);
		}

		try {
			const dsResponse = await this.authenticateOne('DeakinSync', 'https://bff-sync.sync.deakin.edu.au/v1/authorised', {
				Authorization: `Bearer ${trimmedDsToken}`
			});

			authenticated.push(dsResponse as DeakinCredential);
		}
		catch(error) {
			errors.push(error as GraphQLError);
		}

		try {
			const cdResponse = await this.authenticateOne('CloudDeakin', 'https://d2l.deakin.edu.au/d2l/api/lp/1.27/users/whoami', {
				Authorization: `Bearer ${trimmedCdToken}`
			});

			authenticated.push(cdResponse as DeakinCredential);
		}
		catch(error) {
			errors.push(error as GraphQLError);
		}

		if (authenticated.length === systemQty) {
			return {
				status: 202,
				credentials: authenticated,
				errors: null
			};
		}
		else if (authenticated.length === 0) {
			return {
				status: 401,
				credentials: null,
				errors: errors
			};
		}
		else {
			return {
				status: 207,
				credentials: authenticated,
				errors: errors
			};
		}
	},


	setupQueryHeaders: function(auth: AuthResponse): MyQueryContext | undefined {
		if(auth.status === 401) {
			return undefined;
		}

		const dsToken = auth?.credentials?.find(cred => cred.systemName === 'DeakinSync')?.token;
		const cdToken = auth?.credentials?.find(cred => cred.systemName === 'CloudDeakin')?.token;

		return {
			context: {
				headers: {
					username: auth?.credentials?.find(cred => cred.systemName === 'OnTrack')?.username || undefined,
					onTrack: auth?.credentials?.find(cred => cred.systemName === 'OnTrack')?.token || undefined,
					deakinSync: dsToken ? `Bearer ${dsToken}` : undefined,
					cloudDeakin: cdToken ? `Bearer ${cdToken}` : undefined,
				}
			}
		};
	}
};
