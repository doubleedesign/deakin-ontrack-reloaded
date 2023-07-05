import gql from 'graphql-tag';

export const typeDefs = gql`
	type Query {
		getCurrentSubjects: [Subject]
	}
	
	type Subject {
		project_id: Int
		unit_id: Int
		unit_code: String
        name: String
		target_grade: Int
		assignments: [Assignment]
	}
	
	type Assignment {
		id: Int
		target_date: String
		due_date: String
		status: String
	}
`;
