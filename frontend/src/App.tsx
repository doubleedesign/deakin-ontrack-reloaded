import { useCallback, useState, useContext, useEffect } from 'react';
import { CURRENT_SUBJECTS_QUERY, UPCOMING_ASSIGNMENTS_QUERY } from './graphql/queries.ts';
import { useLazyQuery } from '@apollo/client';
import Alert from './components/Alert/Alert.tsx';
import { GraphQLError } from 'graphql/error';
import { AppContext } from './context/AppContextProvider.tsx';
import { Assignment, Subject } from '@server/types.ts';

function App() {
	const { setCredentials, queryOptions } = useContext(AppContext);
	const [errors, setErrors] = useState<GraphQLError[]>([]);
	const [getCurrentSubjects] = useLazyQuery(CURRENT_SUBJECTS_QUERY, { fetchPolicy: 'no-cache' });
	const [currentSubjects, setCurrentSubjects] = useState<Subject[]>();
	const [getUpcomingAssignments] = useLazyQuery(UPCOMING_ASSIGNMENTS_QUERY, { fetchPolicy: 'no-cache' });
	const [upcomingAssignments, setUpcomingAssignments] = useState<Assignment[]>();

	async function handleSubjects() {
		// Stop lying to me, TypeScript. The response contains a detailed 'errors' array when there's errors.
		// @ts-ignore
		const { data, errors } = await getCurrentSubjects(queryOptions);
		if(errors)  {
			setErrors(errors);
		}
		if(data) {
			setCurrentSubjects(data.subjects);
		}
	}

	async function handleAssignments() {
		// @ts-ignore
		const { data, errors } = await getUpcomingAssignments(queryOptions);
		if(errors)  {
			setErrors(errors);
		}
		if(data) {
			setUpcomingAssignments(data.assignments);
		}
	}

	// TODO: This isn't actually working, but keeping it here for now to show the general idea
	function handleOntrack() {
		handleSubjects().then();
		handleAssignments().then();
	}

	useEffect(() => {
		console.log(currentSubjects);
	}, [currentSubjects]);

	useEffect(() => {
		console.log(upcomingAssignments);
	}, [upcomingAssignments]);

	return (
		<>
			<form onSubmit={(event) => setCredentials(event)}>
				<label htmlFor="username">Username</label>
				<input id="username" name="username"/>
				<label htmlFor="token">Auth-Token</label>
				<input id="token" name="token"/>
				<input type="submit" value="Let's go"/>
			</form>

			{queryOptions && <button onClick={handleOntrack}>Get data</button>}

			{errors && errors.map(error => {
				return (
					<Alert message={`${error.extensions.code} ${error.message}`}
				              more={error.extensions.stacktrace as string}
					/>
				);
			})}
		</>
	);
}

export default App;
