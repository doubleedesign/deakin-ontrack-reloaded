import gql from 'graphql-tag';

export const CURRENT_SUBJECTS_QUERY = gql`
    query CurrentUnitsQuery {
        getCurrentSubjects {
            name
        }
    }
`;
