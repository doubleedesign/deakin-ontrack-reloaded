import gql from 'graphql-tag';

export const typeDefs = gql`
	type Query {
		persistentCacheStatus: PersistentCacheStatus
		currentSubjects: [Subject]
		allAssignmentsForSubject(projectId: Int): [Assignment]
	}
	
	type PersistentCacheStatus {
		DeakinSync: String
		CloudDeakin: String
		OnTrack: String
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
		startDate: String,
		endDate: String
		urls: [SubjectURL]
	}
	
	type Assignment {
		id: Int
		unitId: Int
		projectId: Int
		type: String
		abbreviation: String
		name: String
		description: String
        status: String
		target_date: String
		due_date: String
        submission_date: String
		completion_date: String
		target_grade: Int
		weighting: Int
		isGraded: Boolean
		maxPoints: Int
		awardedPoints: Int
	}
`;
