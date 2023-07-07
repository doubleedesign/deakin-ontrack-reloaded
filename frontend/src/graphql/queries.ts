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
