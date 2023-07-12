import gql from 'graphql-tag';
import { TypedDocumentNode } from '@apollo/client';
import { Assignment, Subject } from '@server/types.ts';

export const CURRENT_SUBJECTS_QUERY: TypedDocumentNode<{currentSubjects: Subject[]}> = gql`
    query CurrentSubjectsQuery {
        currentSubjects {
	        projectId,
	        unitId,
            unitCode,
	        name,
	        targetGrade
        }
    }
`;

export const UPCOMING_ASSIGNMENTS_QUERY: TypedDocumentNode<{allUpcomingAssignments: Assignment[]}> = gql`
    query UpcomingAssignmentsQuery {
        allUpcomingAssignments {
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

export const ASSIGNMENTS_FOR_SUBJECT_QUERY: TypedDocumentNode<{allAssignmentsForSubject: Assignment[]}> = gql`
    query AssignmentsForSubjectQuery($projectId: Int, $unitId: Int) {
        allAssignmentsForSubject(projectId: $projectId, unitId: $unitId) {
            abbreviation,
            name,
            due_date,
            status
        }
    }
`;
