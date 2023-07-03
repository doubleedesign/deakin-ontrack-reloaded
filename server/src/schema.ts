import gql from 'graphql-tag';

export const typeDefs = gql`
	type Query {
		getCurrentUnits: [Unit]
	}
	
	type RawUnit {
		campus_id: Int
		id: Int
		portfolio_available: Boolean
		target_grade: Int
		unit: Unit
		user_id: Int
	}
	
	type Unit {
		active: Boolean
		code: String
		name: String
		id: String
		start_date: String
		end_date: String
		my_role: String
		teaching_period: Int
	}
`;
