import gql from 'graphql-tag';
import { TypedDocumentNode } from '@apollo/client';
import { Assignment, Subject } from '@server/types.ts';

export const CURRENT_SUBJECTS_QUERY: TypedDocumentNode<{getCurrentSubjects: Subject[]}> = gql`
    query CurrentSubjectsQuery {
        getCurrentSubjects {
            unitCode,
	        name,
	        targetGrade
        }
    }
`;

export const UPCOMING_ASSIGNMENTS_QUERY: TypedDocumentNode<{getUpcomingAssignments: Assignment[]}> = gql`
    query UpcomingAssignmentsQuery {
        getUpcomingAssignments {
            id,
            name,
            description,
	        target_date,
            due_date,
            unitId,
            projectId
        }
    }
`;

export const ASSIGNMENTS_FOR_SUBJECT_QUERY: TypedDocumentNode<{getAssignmentsForSubject: Assignment[]}> = gql`
    query AssignmentsForSubjectQuery($projectId: Int, $unitId: Int) {
        getAssignmentsForSubject(projectId: $projectId, unitId: $unitId) {
            abbreviation,
            name,
            due_date,
            status
        }
    }
`;
