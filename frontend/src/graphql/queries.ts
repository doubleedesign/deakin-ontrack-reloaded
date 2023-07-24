import gql from 'graphql-tag';
import { TypedDocumentNode } from '@apollo/client';
import { PersistentCacheStatus, Assignment, Subject } from '@server/types.ts';

export const PERSISTENT_CACHE_STATUS_QUERY: TypedDocumentNode<{persistentCacheStatus: PersistentCacheStatus}> = gql`
    query PersistentCacheStatus {
        persistentCacheStatus {
            DeakinSync,
	        CloudDeakin,
	        OnTrack
        }
    }
`;

export const CURRENT_SUBJECTS_QUERY: TypedDocumentNode<{currentSubjects: Subject[]}> = gql`
    query CurrentSubjectsQuery {
        currentSubjects {
	        projectId,
	        unitId,
            unitCode,
	        name,
	        targetGrade,
	        urls {
		        label,
		        url
	        }
        }
    }
`;

export const ASSIGNMENTS_FOR_SUBJECT_QUERY: TypedDocumentNode<{allAssignmentsForSubject: Assignment[]}> = gql`
    query AssignmentsForSubjectQuery($projectId: Int, $unitId: Int) {
        allAssignmentsForSubject(projectId: $projectId, unitId: $unitId) {
	        id,
            abbreviation,
	        description,
            name,
            target_date,
            status,
	        target_grade,
	        submission_date,
	        completion_date
        }
    }
`;
