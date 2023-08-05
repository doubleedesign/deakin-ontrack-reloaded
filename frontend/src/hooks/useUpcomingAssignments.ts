import { useQuery } from '@apollo/client';
import { UPCOMING_ASSIGNMENTS_QUERY } from '../graphql/queries.ts';
import { useContext, useEffect, useState } from 'react';
import { GraphQLError } from 'graphql/error';
import { AppContext } from '../context/AppContextProvider.tsx';
import { Assignment } from '@server/types';

export function useUpcomingAssignments(options: { weeks: number }) {
	const { setErrors } = useContext(AppContext);
	const [results, setResults] = useState<Assignment[]>();

	const { error, loading, data } = useQuery(UPCOMING_ASSIGNMENTS_QUERY,  {
		fetchPolicy: 'no-cache',
		variables: {
			weeks: options.weeks
		}
	});

	useEffect(() => {
		if(error?.graphQLErrors) {
			setErrors(error.graphQLErrors as GraphQLError[]);
		}
		else if(error) {
			setErrors([new GraphQLError(error.message)]);
		}
	}, [error, setErrors]);

	useEffect(() => {
		if(data?.upcomingAssignments) {
			setResults(data?.upcomingAssignments);
		}
	}, [data]);

	return { results, loading };
}
