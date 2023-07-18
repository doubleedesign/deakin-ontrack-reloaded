import { GraphQLError } from 'graphql/error';

export type AuthResponse = {
	status: number;
	credentials: {
		username: string;
		otToken: string;
		dsToken: string;
	} | null,
	errors: GraphQLError[] | null
}

export type MyCredentials = {
	username: string | undefined;
	tokens: {
		onTrack: string | undefined; // 'Auth-Token' request header
		deakinSync: string | undefined; // Bearer token
		cloudDeakin: string | undefined; // Bearer token
	}
}

export type MyQueryContext = {
	context: {
		headers: MyCredentials
	}
}

export type MenuItem = {
	route: string;
	label: string;
	color: string;
}

export type StatusColor = 'error' | 'warning' | 'success' | 'info';
