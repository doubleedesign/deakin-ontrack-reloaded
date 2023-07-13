import { useState, useContext, useEffect } from 'react';
import { CURRENT_SUBJECTS_QUERY } from './graphql/queries.ts';
import { useLazyQuery } from '@apollo/client';
import Alert from './components/Alert/Alert.tsx';
import { AppContext } from './context/AppContextProvider.tsx';
import { Subject } from '@server/types.ts';
import SubjectSummary from './components/SubjectSummary/SubjectSummary.tsx';

function App() {
	const { setCredentials, authenticated, queryOptions, errors, setErrors } = useContext(AppContext);
	const [getCurrentSubjects] = useLazyQuery(CURRENT_SUBJECTS_QUERY, { fetchPolicy: 'network-only', nextFetchPolicy: 'cache-first' });
	const [currentSubjects, setCurrentSubjects] = useState<Subject[]>();

	useEffect(() => {
		if(authenticated && queryOptions) {
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
		else {
			setCurrentSubjects([]);
		}
	}, [authenticated, queryOptions]);

	return (
		<>
			<form onSubmit={(event) => setCredentials(event)}>
				<label htmlFor="username">Username</label>
				<input id="username" name="username" defaultValue={queryOptions?.context?.headers?.username}/>
				<label htmlFor="token">Auth-Token</label>
				<input id="token" name="token" defaultValue={queryOptions?.context?.headers['Auth-Token']}/>
				<input type="submit" value="Let's go"/>
			</form>

			{errors && errors.map((error, index) => {
				console.error(`${error.extensions?.code} ${error.message} ${error.extensions?.stacktrace as string}`);
				return (
					<Alert key={`error-${index}`}
					       message={`${error.extensions?.code} ${error.message}`}
			               more={error.extensions?.note as string}
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
