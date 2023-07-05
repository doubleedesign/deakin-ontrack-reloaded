import gql from 'graphql-tag';

export const typeDefs = gql`
	type Query {
		getCurrentSubjects: [Subject]
	}
	
	type Subject {
		projectId: Int
		unitId: Int
		unitCode: String
        name: String
		targetGrade: Int
	}
	
	type Assignment {
		id: Int
		targetDate: String
		dueDate: String
		status: String
	}
`;
