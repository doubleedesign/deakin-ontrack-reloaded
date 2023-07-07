import gql from 'graphql-tag';
import { TypedDocumentNode } from '@apollo/client';
import { Assignment, Subject } from '@server/types.ts';

export const CURRENT_SUBJECTS_QUERY: TypedDocumentNode<{subjects: Subject[]}> = gql`
    query CurrentSubjectsQuery {
        getCurrentSubjects {
            unitCode,
	        name,
	        targetGrade
        }
    }
`;

export const UPCOMING_ASSIGNMENTS_QUERY: TypedDocumentNode<{assignments: Assignment[]}> = gql`
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
