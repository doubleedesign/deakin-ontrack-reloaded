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
		abbreviation: String
		name: String
		description: String
        status: String
		targetDate: String
		dueDate: String
        submissionDate: String
		completionDate: String
		weighting: Int
		isGraded: Boolean
		maxPoints: Int
		awardedPoints: Int
	}
`;
