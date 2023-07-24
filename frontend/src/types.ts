import { GraphQLError } from 'graphql/error';
import { Assignment } from '@server/types.ts';

export type SystemName = 'OnTrack' | 'DeakinSync' | 'CloudDeakin';

export type DeakinCredential = {
	systemName: SystemName;
	token: string;
	username?: string;
}

export type AuthResponse = {
	status: number;
	credentials: DeakinCredential[] | null,
	errors: GraphQLError[] | null
}

export type AuthStatus = {
	isAuthenticated: {[K in SystemName]: boolean},
	errors: GraphQLError[]
}

export type DrawerStatus = 'settings' | 'notifications' | false;

export type MyCredentials = {
	username: string | undefined;
	onTrack: string | undefined; // 'Auth-Token' request header
	deakinSync: string | undefined; // Bearer token
	cloudDeakin: string | undefined; // Bearer token
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

export type AssignmentCluster = {
	label: string;
	endDate: Date;
	assignments: Assignment[];
}
