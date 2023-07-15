import {
	createContext,
	useState,
	useEffect,
	FC,
	PropsWithChildren,
	FormEvent, Dispatch, SetStateAction
} from 'react';
import { GraphQLError } from 'graphql/error';
import { useLocalStorage } from '../hooks/useLocalStorage.ts';
import { useLazyQuery } from '@apollo/client';
import { CURRENT_SUBJECTS_QUERY } from '../graphql/queries.ts';
import { Subject } from '@server/types.ts';
import { tabColors } from '../constants.ts';

export interface MyAppContext {
	setCredentials: (event: FormEvent<HTMLFormElement>) => void;
	authenticated: boolean;
	queryOptions: MyQueryContext | undefined,
	currentSubjects: Subject[],
	errors: GraphQLError[];
	setErrors: Dispatch<SetStateAction<GraphQLError[]>>;
	theme: 'light' | 'dark';
	setTheme: Dispatch<SetStateAction<'light' | 'dark'>>;
}
export const AppContext = createContext({} as MyAppContext);

interface MyCredentials {
	username: string | undefined;
	'Auth-Token': string | undefined;
}

interface MyQueryContext {
	context: {
		headers: MyCredentials
	}
}

const AppContextProvider: FC<PropsWithChildren> = function({ children }) {
	const { value: username, setValue: setUsername } = useLocalStorage('otr_username', '');
	const { value: token, setValue: setToken } = useLocalStorage('otr_token', '');
	const [authenticated, setAuthenticated] = useState<boolean>(false);
	const [queryOptions, setQueryOptions] = useState<MyQueryContext | undefined>(undefined);
	const [errors, setErrors] = useState<GraphQLError[]>([]);
	const [theme, setTheme] = useState<'light' | 'dark'>('light');
	const [getCurrentSubjects] = useLazyQuery(CURRENT_SUBJECTS_QUERY, { fetchPolicy: 'network-only', nextFetchPolicy: 'cache-first' });
	const [currentSubjects, setCurrentSubjects] = useState<Subject[]>([]);

	function authenticate(username: string, token: string) {
		if(username && token) {
			// Hit an endpoint that requires authentication but doesn't return much data, just to see if I can
			// TODO: Handle the mock API - only require auth if really accessing OnTrack
			fetch('https://ontrack.deakin.edu.au/api/unit_roles', {
				method: 'GET',
				headers: {
					username: username,
					'Auth-Token': token
				} })
				.then(response => {
					if(response.status === 200) {
						setUsername(username);
						setToken(token);
						setAuthenticated(true);
						setErrors([]);
						setQueryOptions({
							context: {
								headers: {
									username: username,
									'Auth-Token': token
								}
							}
						});
					}
					else {
						clearAuthStatus();
						throw new GraphQLError('Error authenticating with OnTrack', {
							extensions: {
								code: response.status,
								stacktrace: './frontend/src/context/AppContextProvider.tsx'
							}
						});
					}
				})
				.catch(error => {
					clearAuthStatus();
					setErrors([new GraphQLError(error.message, { extensions: {
						code: 401,
						stacktrace: './frontend/src/context/AppContextProvider.tsx'
					} })]);
				});
		}
		else {
			clearAuthStatus();
			setErrors([new GraphQLError('Hey, I\'m gonna need to see some ID.', {
				extensions: {
					code: 401,
					note: 'Please enter your username and auth token.',
					stacktrace: './frontend/src/context/AppContextProvider.tsx',
				}
			})]);
		}
	}

	function clearAuthStatus() {
		setAuthenticated(false);
		setQueryOptions(undefined);
	}

	// Authenticate with values saved in local storage on load
	useEffect(() => {
		authenticate(username, token);
	}, []);

	// Function to update credentials and re-authenticate that can be called on form submissions in other components
	const setCredentials = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const creds = new FormData(event.currentTarget);
		const username = creds.get('username') as string;
		const token = creds.get('token') as string;

		authenticate(username, token);
	};

	useEffect(() => {
		if(authenticated && queryOptions) {
			getCurrentSubjects(queryOptions).then(response => {
				if (response.data) {
					setCurrentSubjects(response.data.currentSubjects.map((item, index) => {
						return {
							...item,
							color: tabColors[index]
						};
					}));
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
		<AppContext.Provider value={{ theme, setTheme, setCredentials, authenticated, queryOptions, currentSubjects, errors, setErrors }}>
			{children}
		</AppContext.Provider>);
};

export default AppContextProvider;
