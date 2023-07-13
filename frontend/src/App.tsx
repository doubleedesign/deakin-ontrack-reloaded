import { useState, useContext, useEffect } from 'react';
import { CURRENT_SUBJECTS_QUERY } from './graphql/queries.ts';
import { useLazyQuery } from '@apollo/client';
import Alert from './components/Alert/Alert.tsx';
import { AppContext } from './context/AppContextProvider.tsx';
import { Subject } from '@server/types.ts';
import SubjectSummary from './components/SubjectSummary/SubjectSummary.tsx';
import { useLocalStorage } from './hooks/useLocalStorage.ts';

function App() {
	const { setCredentials, authenticated, queryOptions, errors, setErrors } = useContext(AppContext);
	const [getCurrentSubjects] = useLazyQuery(CURRENT_SUBJECTS_QUERY, { fetchPolicy: 'network-only', nextFetchPolicy: 'cache-first' });
	const [currentSubjects, setCurrentSubjects] = useState<Subject[]>();
	// I feel like the creds shouldn't be directly available from the context object, but I guess
	// having them in browser storage kind of amounts to the same thing...? (Also they're in the queryOptions anyway...)
	const { value: username } = useLocalStorage('otr_username', '');
	const { value: token } = useLocalStorage('otr_token', '');

	useEffect(() => {
		if(authenticated) {
			getCurrentSubjects(queryOptions).then(response => {
				if (response.data) {
					setCurrentSubjects(response.data.currentSubjects);
					setErrors([]);
				}
				// Stop lying to me about what fields can be there, TypeScript
				// @ts-ignore
				if (response?.errors) {
					// @ts-ignore
					setErrors(response.errors);
				}
			});
		}
	}, [authenticated]);

	return (
		<>
			<form onSubmit={(event) => setCredentials(event)}>
				<label htmlFor="username">Username</label>
				<input id="username" name="username" defaultValue={username}/>
				<label htmlFor="token">Auth-Token</label>
				<input id="token" name="token" defaultValue={token}/>
				<input type="submit" value="Let's go"/>
			</form>

			{errors && errors.map((error, index) => {
				return (
					<Alert key={index} message={`${error.extensions.code} ${error.message}`}
				              more={error.extensions.stacktrace as string}
					/>
				);
			})}

			{currentSubjects && currentSubjects.map(subject => {
				return <SubjectSummary key={subject.projectId} subject={subject}/>;
			})}
		</>
	);
}

export default App;
