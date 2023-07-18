import {
	createContext,
	useState,
	useCallback,
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
import { auth } from './auth.ts';
import { AuthResponse, MyQueryContext, SystemName } from '../types.ts';

export interface MyAppContext {
	setCredentials: (event: FormEvent<HTMLFormElement>) => Promise<{ authenticated: SystemName[], errors: GraphQLError[] }>;
	clearCredentials: () => void;
	authenticated: { authenticated: SystemName[], errors: GraphQLError[] } | undefined;
	queryOptions: MyQueryContext | undefined,
	currentSubjects: Subject[],
	errors: GraphQLError[];
	setErrors: Dispatch<SetStateAction<GraphQLError[]>>;
	theme: 'light' | 'dark';
	setTheme: Dispatch<SetStateAction<'light' | 'dark'>>;
	userDrawerOpen: boolean;
	setUserDrawerOpen: Dispatch<SetStateAction<boolean>>;
}
export const AppContext = createContext({} as MyAppContext);

const AppContextProvider: FC<PropsWithChildren> = function({ children }) {
	// Auth tokens
	const { value: username, setValue: setUsername } = useLocalStorage<string | null>('otr_username', null);
	const { value: otToken, setValue: setOtToken } = useLocalStorage<string | null>('otr_token', null);
	const { value: dsToken, setValue: setDsToken } = useLocalStorage<string | null>('ds_token', null);
	const { value: cdToken, setValue: setCdToken } = useLocalStorage<string | null>('cd_token', null);

	// All the auth together to query my GraphQL BFF
	const [queryOptions, setQueryOptions] = useState<MyQueryContext | undefined>(undefined);
	const [authenticated, setAuthenticated] = useState<{authenticated: SystemName[], errors: GraphQLError[]}>();

	// Everything else
	const [errors, setErrors] = useState<GraphQLError[]>([]);
	const [theme, setTheme] = useState<'light' | 'dark'>('light');
	const [userDrawerOpen, setUserDrawerOpen] = useState<boolean>(false);
	const [getCurrentSubjects] = useLazyQuery(CURRENT_SUBJECTS_QUERY, { fetchPolicy: 'network-only', nextFetchPolicy: 'cache-first' });
	const [currentSubjects, setCurrentSubjects] = useState<Subject[]>([]);


	// Function to clear auth-related state
	const clearCredentials = useCallback(() => {
		setQueryOptions(undefined);
		setAuthenticated(undefined);
		setUsername(null);
		setOtToken(null);
		setDsToken(null);
		setCdToken(null);
	}, [setCdToken, setDsToken, setOtToken, setUsername]);


	// Function to call auth function and update state based on its results
	const authenticate = useCallback(async (username: string, submittedOtToken: string, submittedDsToken: string, submittedCdToken: string): Promise<{
		authenticated: SystemName[];
		errors: GraphQLError[]
	}> => {
		const result: AuthResponse = await auth.authenticateAll(username, submittedOtToken, submittedDsToken, submittedCdToken);

		// Save credentials for GraphQL query headers
		setQueryOptions(auth.setupQueryHeaders(result));
		
		// Update local storage
		setUsername(username);
		result.credentials && result.credentials.find(cred => cred.systemName === 'OnTrack')
			? setOtToken(submittedOtToken) : setOtToken(null);
		result.credentials && result.credentials.find(cred => cred.systemName === 'DeakinSync')
			? setDsToken(submittedDsToken) : setDsToken(null);
		result.credentials && result.credentials.find(cred => cred.systemName === 'CloudDeakin')
			? setCdToken(submittedCdToken) : setCdToken(null);


		// Close the panel if all creds are valid
		result?.credentials?.length === 4 && setUserDrawerOpen(false);

		// Return info about authenticated systems to the caller,
		// for things like highlighting form fields with invalid credentials
		const data = {
			authenticated: result?.credentials?.map(cred => cred.systemName) || [],
			errors: result.errors || []
		};

		setAuthenticated(data);
		return data;
	}, [setCdToken, setDsToken, setOtToken, setUsername]);


	// Function to update credentials and re-authenticate that can be called on form submissions in other components
	const setCredentials = useCallback(async (event: FormEvent<HTMLFormElement>): Promise<{
		authenticated: SystemName[];
		errors: GraphQLError[]
	}> => {
		event.preventDefault();
		const creds = new FormData(event.currentTarget);
		const username = creds.get('username') as string;
		const otToken = creds.get('otToken') as string;
		const dsToken = creds.get('dsToken') as string;
		const cdToken = creds.get('cdToken') as string;

		return await authenticate(username, otToken, dsToken, cdToken);
	}, [authenticate]);

	// Authenticate with values saved in local storage on initial load
	useEffect(() => {
		authenticate(username as string, otToken as string, dsToken as string, cdToken as string).then();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Once auth is all sorted: fetch current subjects, assign theme colours to them, and store them
	useEffect(() => {
		if(queryOptions) {
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
	}, [queryOptions, getCurrentSubjects, theme]);

	return (
		<AppContext.Provider value={{
			theme, setTheme,
			userDrawerOpen, setUserDrawerOpen,
			authenticated,
			setCredentials, clearCredentials,
			queryOptions,
			currentSubjects,
			errors, setErrors
		}}>
			{children}
		</AppContext.Provider>);
};

export default AppContextProvider;
