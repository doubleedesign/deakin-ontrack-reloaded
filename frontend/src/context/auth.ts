import { GraphQLError } from 'graphql/error';
import { AuthResponse, MyCredentials, MyQueryContext } from '../types.ts';

export const auth = {

	// TODO: Handle the mock API - only require auth if really accessing the real systems
	authenticate: function(username: string, submittedOtToken: string, submittedDsToken: string): AuthResponse {
		let otAuthStatus: boolean = false;
		let dsAuthStatus: boolean = false;
		const errors: GraphQLError[] = [];

		// OnTrack
		const trimmedOtToken = submittedOtToken.trim();
		// Hit an endpoint that requires authentication but doesn't return much data, just to see if I can
		fetch('https://ontrack.deakin.edu.au/api/unit_roles', {
			method: 'GET',
			headers: {
				username: username,
				'Auth-Token': trimmedOtToken
			} })
			.then(response => {
				if(response.status === 200) {
					otAuthStatus = true;
				}
				else {
					errors.push(new GraphQLError('Unknown problem authenticating with OnTrack', { extensions: {
						code: response.status,
						stacktrace: './frontend/src/context/auth.ts'
					} }));
				}
			})
			.catch(error => {
				errors.push(new GraphQLError(error.message, { extensions: {
					code: 401,
					stacktrace: './frontend/src/context/auth.ts'
				} }));
			});

		// DeakinSync
		// Make sure "Bearer" won't be included twice, and it doesn't matter if it's submitted with it or not
		const trimmedDsToken = submittedDsToken.replace('Bearer', '').trim();
		fetch('https://bff-sync.sync.deakin.edu.au/v1/authorised', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${trimmedDsToken}`
			}
		}).then(response => {
			if(response.status === 200) {
				dsAuthStatus = true;
			}
			else {
				errors.push(new GraphQLError('Unknown problem authenticating with DeakinSync', { extensions: {
					code: response.status,
					stacktrace: './frontend/src/context/auth.ts'
				} }));
			}
		}).catch(error => {
			errors.push(new GraphQLError(error.message, { extensions: {
				code: 401,
				stacktrace: './frontend/src/context/auth.ts'
			} }));
		});


		if(errors.length > 0) {
			console.error(errors);
			return {
				status: 401,
				credentials: null,
				errors: errors
			};
		}
		else {
			return {
				status: 202,
				credentials: {
					username: username,
					otToken: trimmedOtToken,
					dsToken: trimmedDsToken
				},
				errors: null
			};
		}
	},

	setupQueryHeaders: function(auth: AuthResponse): MyQueryContext | undefined {
		if(auth.errors) {
			return undefined;
		}
		return {
			context: {
				headers: {
					username: auth?.credentials?.username,
					tokens: {
						onTrack: auth?.credentials?.otToken,
						deakinSync: `Bearer ${auth?.credentials?.dsToken}`,
						cloudDeakin: undefined // TODO
					}
				}
			} };
	}
};
