import gql from 'graphql-tag';
import { TypedDocumentNode } from '@apollo/client';
import { Subject } from '@server/types.ts';

export const CURRENT_SUBJECTS_QUERY: TypedDocumentNode<Subject> = gql`
    query CurrentSubjectsQuery {
        getCurrentSubjects {
            unitCode,
	        name,
	        targetGrade
        }
    }
`;
