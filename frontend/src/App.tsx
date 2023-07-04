import { FormEvent, useCallback, useState, useEffect } from 'react';
import { CURRENT_UNITS_QUERY } from './graphql/queries.ts';
import { LazyQueryResult, useLazyQuery } from '@apollo/client';
import Alert from './components/Alert/Alert.tsx';
import { GraphQLError } from 'graphql/error';

function App() {
	const [username, setUsername] = useState<string>();
	const [token, setToken] = useState<string>();
	const [queryOptions, setQueryOptions] = useState({
		context: {
			headers: {}
		}
	});
	const [getCurrentUnits] = useLazyQuery(CURRENT_UNITS_QUERY, { fetchPolicy: 'no-cache' });
	const [errors, setErrors] = useState<GraphQLError[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const handleCredentials = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const creds = new FormData(event.currentTarget);
		setUsername(creds.get('username') as string);
		setToken(creds.get('token') as string);
	}, []);

	useEffect(() => {
		setQueryOptions({
			context: {
				headers: {
					username: username,
					'auth-token': token
				}
			}
		});
	}, [username, token]);

	const handleOntrack = useCallback(async function handleOntrack() {
		const current: LazyQueryResult<any, any> = await getCurrentUnits(queryOptions);
		setLoading(current.loading);
		// Stop lying to me, TypeScript. The response contains a detailed 'errors' array.
		// @ts-ignore
		if(current.errors)  {
			// @ts-ignore
			setErrors(current.errors);
		}
	}, [getCurrentUnits, queryOptions]);

	return (
		<>
			<form onSubmit={handleCredentials}>
				<label htmlFor="username">Username</label>
				<input id="username" name="username"/>
				<label htmlFor="token">Auth-Token</label>
				<input id="token" name="token"/>
				<input type="submit" value="Let's go"/>
			</form>

			{username && token && <button onClick={handleOntrack}>Get data</button>}

			{errors && errors.map(error => {
				console.log(error);
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
