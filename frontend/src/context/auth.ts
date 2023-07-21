import { GraphQLError } from 'graphql/error';
import { AuthResponse, DeakinCredential, MyQueryContext, SystemName } from '../types.ts';

export const auth = {

	// Note: Each call should hit an endpoint that requires authentication but doesn't return much data, just to see if I can
	authenticateOne: async function(name: SystemName, url: string, headers: any): Promise<DeakinCredential> {
		const response: Response = await fetch(url, {
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
			const more = await response.json();
			let message = response.statusText;
			if(response.statusText === 'status code 419') {
				if(more?.detail || more?.error) {
					message = `${more?.detail || more?.error}`;
				}
			}
			else if(more?.detail || more?.error) {
				message = `${message}: ${more?.detail || more?.error}`;
			}
			throw new GraphQLError(`${response.statusText} - ${name}`, {
				extensions: {
					code: response.status,
					statusText: message,
					systemName: name,
					stacktrace: './frontend/src/context/auth.ts'
				}
			});
		}
	},


	// TODO: Handle the mock API - only require auth if really accessing the real systems
	// eslint-disable-next-line max-len
	authenticateAll: async function (username: string, submittedOtToken: string, submittedDsToken: string, submittedCdToken: string): Promise<AuthResponse> {
		const errors: GraphQLError[] = [];
		const authenticated: DeakinCredential[] = [];
		const systemQty = 3;

		const trimmedOtToken = submittedOtToken.trim();
		// Make sure "Bearer" won't be included twice, and it doesn't matter if it's submitted with it or not
		const trimmedDsToken = submittedDsToken ? submittedDsToken.replaceAll('Bearer', '').trim() : '';
		const trimmedCdToken = submittedCdToken ? submittedCdToken.replaceAll('Bearer', '').trim() : '';

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
			console.log(error);
			if(error instanceof SyntaxError) {
				// Living on the edge, might refactor later
				// This is not really a GraphQL error, but having it masquerade as one is easier (at least for now)
				errors.push(new GraphQLError(error.message, {
					extensions: {
						code: 400,
						statusText: 'Syntax error',
						systemName: 'DeakinSync',
						stacktrace: './frontend/src/context/auth.ts'
					}
				}));
			}
			else {
				errors.push(error as GraphQLError);
			}
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
					deakinSync: dsToken ? `${dsToken}` : undefined,
					cloudDeakin: cdToken ? `${cdToken}` : undefined,
				}
			}
		};
	}
};
