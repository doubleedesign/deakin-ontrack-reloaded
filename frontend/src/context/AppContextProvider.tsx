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
import { lightTheme, darkTheme } from '../theme.ts';
import { adjustHue, tint, complement } from 'polished';

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
	Authorization: string | undefined;
}

interface MyQueryContext {
	context: {
		headers: MyCredentials
	}
}

const AppContextProvider: FC<PropsWithChildren> = function({ children }) {
	// OnTrack auth
	const { value: username, setValue: setUsername } = useLocalStorage('otr_username', '');
	const { value: otToken, setValue: setOtToken } = useLocalStorage('otr_token', '');
	const [otAuthenticated, setOtAuthenticated] = useState<boolean>(false);

	// DeakinSync auth
	const { value: dsToken, setValue: setDsToken } = useLocalStorage('ds_token', '');
	const [dsAuthenticated, setDsAuthenticated] = useState<boolean>(false);

	// All the auth together to query my GraphQL BFF
	const [queryOptions, setQueryOptions] = useState<MyQueryContext | undefined>(undefined);

	// Everything else
	const [errors, setErrors] = useState<GraphQLError[]>([]);
	const [theme, setTheme] = useState<'light' | 'dark'>('light');
	const [getCurrentSubjects] = useLazyQuery(CURRENT_SUBJECTS_QUERY, { fetchPolicy: 'network-only', nextFetchPolicy: 'cache-first' });
	const [currentSubjects, setCurrentSubjects] = useState<Subject[]>([]);

	// TODO: Handle the mock API - only require auth if really accessing OnTrack
	function authenticate(username: string, submittedOtToken: string, submittedDsToken: string) {
		if(username && submittedDsToken) {
			// Hit an endpoint that requires authentication but doesn't return much data, just to see if I can
			fetch('https://ontrack.deakin.edu.au/api/unit_roles', {
				method: 'GET',
				headers: {
					username: username,
					'Auth-Token': submittedOtToken
				} })
				.then(response => {
					if(response.status === 200) {
						setUsername(username);
						setOtToken(submittedOtToken);
						setOtAuthenticated(true);
						setErrors([]);
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
		if(submittedDsToken) {
			fetch('https://bff-sync.sync.deakin.edu.au/v1/authorised', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${submittedDsToken}`
				}
			}).then(response => {
				if(response.status === 200) {
					setDsToken(submittedDsToken);
					setDsAuthenticated(true);
					setErrors([]);
				}
			}).catch(error => {
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
					note: 'Please enter your username and auth token for OnTrack and Bearer token for DeakinSync.',
					stacktrace: './frontend/src/context/AppContextProvider.tsx',
				}
			})]);
		}
	}

	function clearAuthStatus() {
		setOtAuthenticated(false);
		setQueryOptions(undefined);
	}

	// Authenticate with values saved in local storage on load
	useEffect(() => {
		authenticate(username, otToken, dsToken);
	}, []);

	// Set up query headers after authentication
	useEffect(() => {
		const creds = {
			username: '',
			'Auth-Token': '',
			Authorization: ''
		};

		if(otAuthenticated) {
			creds.username = username;
			creds['Auth-Token'] = otToken;
		}

		if(dsAuthenticated) {
			creds.Authorization = `Bearer ${dsToken}`;
		}

		setQueryOptions({
			context: {
				headers: creds
			}
		});
	}, [otAuthenticated, otToken, dsAuthenticated, dsToken]);

	// Function to update credentials and re-authenticate that can be called on form submissions in other components
	const setCredentials = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const creds = new FormData(event.currentTarget);
		const username = creds.get('username') as string;
		const otToken = creds.get('otToken') as string;
		const dsToken = creds.get('dsToken') as string;

		authenticate(username, otToken, dsToken);
	};

	useEffect(() => {
		if(otAuthenticated && queryOptions) {
			const themeObject = theme === 'light' ? lightTheme : darkTheme;
			getCurrentSubjects(queryOptions).then(response => {
				if (response.data) {
					setCurrentSubjects(response.data.currentSubjects.map((item, index) => {
						return {
							...item,
							color: index % 2 === 0
								? adjustHue(30 * index, tint(0.2, themeObject.colors.secondary))
								: complement(adjustHue(30 * index, tint(0.2, themeObject.colors.secondary)))
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
	}, [otAuthenticated, queryOptions, theme]);

	return (
		<AppContext.Provider value={{ theme, setTheme, setCredentials, authenticated: otAuthenticated, queryOptions, currentSubjects, errors, setErrors }}>
			{children}
		</AppContext.Provider>);
};

export default AppContextProvider;
