import { useState, useContext, useEffect } from 'react';
import { CURRENT_SUBJECTS_QUERY } from './graphql/queries.ts';
import { useLazyQuery } from '@apollo/client';
import Alert from './components/Alert/Alert.tsx';
import { AppContext } from './context/AppContextProvider.tsx';
import { Subject } from '@server/types.ts';

function App() {
	const { setCredentials, authenticated, queryOptions, errors, setErrors } = useContext(AppContext);
	const [getCurrentSubjects] = useLazyQuery(CURRENT_SUBJECTS_QUERY, { fetchPolicy: 'no-cache' });
	const [currentSubjects, setCurrentSubjects] = useState<Subject[]>();

	useEffect(() => {
		getCurrentSubjects(queryOptions).then(response => {
			if(response.data) {
				setCurrentSubjects(response.data.currentSubjects);
				setErrors([]);
			}
			// Stop lying to me about what fields can be there, TypeScript
			// @ts-ignore
			if(response?.errors) {
				// @ts-ignore
				setErrors(response.errors);
			}
		});
	}, [authenticated]);

	return (
		<>
			<form onSubmit={(event) => setCredentials(event)}>
				<label htmlFor="username">Username</label>
				<input id="username" name="username"/>
				<label htmlFor="token">Auth-Token</label>
				<input id="token" name="token"/>
				<input type="submit" value="Let's go"/>
			</form>

			{errors && errors.map(error => {
				return (
					<Alert message={`${error.extensions.code} ${error.message}`}
				              more={error.extensions.stacktrace as string}
					/>
				);
			})}

			{currentSubjects && currentSubjects.map(subject => {
				// TODO: Load a subject summary component
			})}
		</>
	);
}

export default App;
