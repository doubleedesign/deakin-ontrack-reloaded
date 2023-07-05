import gql from 'graphql-tag';

export const CURRENT_SUBJECTS_QUERY = gql`
    query CurrentSubjectsQuery {
        getCurrentSubjects {
            unitCode,
	        name,
	        targetGrade
        }
    }
`;
