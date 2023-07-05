import { useCallback, useState, useContext, useEffect } from 'react';
import { CURRENT_UNITS_QUERY } from './graphql/queries.ts';
import { useLazyQuery } from '@apollo/client';
import Alert from './components/Alert/Alert.tsx';
import { GraphQLError } from 'graphql/error';
import { AppContext } from './context/AppContextProvider.tsx';
import { Unit } from '@server/types.ts';

function App() {
	const { setCredentials, queryOptions } = useContext(AppContext);
	const [getCurrentUnits] = useLazyQuery(CURRENT_UNITS_QUERY, { fetchPolicy: 'no-cache' });
	const [errors, setErrors] = useState<GraphQLError[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [currentUnits, setCurrentUnits] = useState<Partial<Unit>[]>();

	const handleOntrack = useCallback(async function handleOntrack() {
		// Stop lying to me, TypeScript. The response contains a detailed 'errors' array.
		// @ts-ignore
		const { loading, data, errors } = await getCurrentUnits(queryOptions);
		setLoading(loading);
		if(errors)  {
			setErrors(errors);
		}
		if(data) {
			setCurrentUnits(data.getCurrentUnits);
		}
	}, [getCurrentUnits, queryOptions]);

	useEffect(() => {
		console.log(currentUnits);
	}, [currentUnits]);

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
