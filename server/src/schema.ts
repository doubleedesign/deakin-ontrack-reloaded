import gql from 'graphql-tag';

// Note: As a general rule, the idea is that snake_case fields are brought in as-is from the API and camelCase are ones I've added/customised

export const typeDefs = gql`
	type Query {
		persistentCacheStatus: PersistentCacheStatus
		currentSubjects: [Subject]
		allAssignmentsForSubject(projectId: Int): [Assignment]
		upcomingAssignments(weeks: Int): [Assignment]
		assignmentDetail(projectId: Int, taskDefId: Int): AssignmentDetail
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
		targetGrade: Int
		startDate: String
		endDate: String
		isOnTrackUnit: Boolean
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
	
	type AssignmentDetail {
		isOnTrackUnit: Boolean
        taskSheetUrl: String
        taskResourcesUrl: String
	}
`;
