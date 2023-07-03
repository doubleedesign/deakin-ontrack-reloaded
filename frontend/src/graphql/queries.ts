import gql from 'graphql-tag';

export const CURRENT_UNITS_QUERY = gql`
    query CurrentUnitsQuery {
        getCurrentUnits {
            name,
            id
        }
    }
`;
