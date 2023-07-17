import gql from 'graphql-tag';

export const typeDefs = gql`
	type Query {
		currentSubjects: [Subject]
		allUpcomingAssignments: [Assignment]
		allAssignmentsForSubject(projectId: Int, unitId: Int): [Assignment]
	}
	
	type SubjectURL {
		label: String
		url: String
	}
	
	type Subject {
		projectId: Int
		unitId: Int
		unitCode: String
        name: String
		targetGrade: Int,
		urls: [SubjectURL]
	}
	
	type Assignment {
		id: Int
		unitId: Int
		projectId: Int
		abbreviation: String
		name: String
		description: String
        status: String
		target_date: String
		due_date: String
        submission_date: String
		completion_date: String
		weighting: Int
		isGraded: Boolean
		maxPoints: Int
		awardedPoints: Int
	}
`;
