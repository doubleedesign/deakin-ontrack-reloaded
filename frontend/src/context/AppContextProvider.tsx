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
import { AuthResponse, AuthStatus, DrawerStatus, MyQueryContext } from '../types.ts';

export interface MyAppContext {
	setCredentials: (event: FormEvent<HTMLFormElement>) => Promise<AuthStatus>;
	clearCredentials: () => void;
	authenticated: AuthStatus;
	queryOptions: MyQueryContext | undefined,
	currentSubjects: Subject[],
	errors: GraphQLError[];
	setErrors: Dispatch<SetStateAction<GraphQLError[]>>;
	infoMessages: string[];
	setInfoMessages: Dispatch<SetStateAction<string[]>>;
	warningMessages: string[];
	setWarningMessages: Dispatch<SetStateAction<string[]>>;
	theme: 'light' | 'dark';
	setTheme: Dispatch<SetStateAction<'light' | 'dark'>>;
	drawerOpen: DrawerStatus;
	setDrawerOpen: Dispatch<SetStateAction<DrawerStatus>>;
}
export const AppContext = createContext({} as MyAppContext);

const emptyAuthStatus: AuthStatus = {
	isAuthenticated: {
		DeakinSync: false,
		CloudDeakin: false,
		OnTrack: false
	},
	errors: []
};

const AppContextProvider: FC<PropsWithChildren> = function({ children }) {
	// Auth tokens
	const { value: username, setValue: setUsername } = useLocalStorage<string | null>('otr_username', null);
	const { value: otToken, setValue: setOtToken } = useLocalStorage<string | null>('otr_token', null);
	const { value: dsToken, setValue: setDsToken } = useLocalStorage<string | null>('ds_token', null);
	const { value: cdToken, setValue: setCdToken } = useLocalStorage<string | null>('cd_token', null);

	// All the auth together to query my GraphQL BFF
	const [queryOptions, setQueryOptions] = useState<MyQueryContext | undefined>(undefined);
	const [authenticated, setAuthenticated] = useState<AuthStatus>(emptyAuthStatus);

	// Everything else
	const [infoMessages, setInfoMessages] = useState<string[]>([]);
	const [warningMessages, setWarningMessages] = useState<string[]>([]);
	const [errors, setErrors] = useState<GraphQLError[]>([]);
	const [theme, setTheme] = useState<'light' | 'dark'>('light');
	const [drawerOpen, setDrawerOpen] = useState<DrawerStatus>(false);
	const [getCurrentSubjects] = useLazyQuery(CURRENT_SUBJECTS_QUERY, { fetchPolicy: 'network-only', nextFetchPolicy: 'cache-first' });
	const [currentSubjects, setCurrentSubjects] = useState<Subject[]>([]);


	// Function to clear auth-related state
	const clearCredentials = useCallback(() => {
		setQueryOptions(undefined);
		setAuthenticated(emptyAuthStatus);
		setUsername(null);
		setOtToken(null);
		setDsToken(null);
		setCdToken(null);
	}, [setCdToken, setDsToken, setOtToken, setUsername]);


	// Function to call auth function and update state based on its results
	const authenticate = useCallback(async (username: string, submittedOtToken: string, submittedDsToken: string, submittedCdToken: string): Promise<AuthStatus> => {
		const result: AuthResponse = await auth.authenticateAll(username, submittedOtToken, submittedDsToken, submittedCdToken);

		// Save credentials for GraphQL query headers
		setQueryOptions(auth.setupQueryHeaders(result));

		// Update local storage
		setUsername(username);
		result.credentials && result.credentials.find(cred => cred.systemName === 'OnTrack')
			? setOtToken(submittedOtToken.trim()) : setOtToken(null);
		result.credentials && result.credentials.find(cred => cred.systemName === 'DeakinSync')
			? setDsToken(submittedDsToken.replaceAll('Bearer', '').trim()) : setDsToken(null);
		result.credentials && result.credentials.find(cred => cred.systemName === 'CloudDeakin')
			? setCdToken(submittedCdToken.replaceAll('Bearer', '').trim()) : setCdToken(null);

		// Return info about authenticated systems to the caller,
		// for things like highlighting form fields with invalid credentials
		const data = {
			isAuthenticated: {
				OnTrack: result?.credentials?.some(cred => cred.systemName === 'OnTrack') || false,
				DeakinSync: result?.credentials?.some(cred => cred.systemName === 'DeakinSync') || false,
				CloudDeakin: result?.credentials?.some(cred => cred.systemName === 'CloudDeakin') || false,
			},
			errors: result.errors || []
		};

		// Close the panel if all creds are valid
		if(Object.values(data.isAuthenticated).every(item => item === true)) {
			setDrawerOpen(false);
		}

		// Update state and return result to caller because it might want to do more stuff
		setAuthenticated(data);
		return data;
	}, [setCdToken, setDsToken, setOtToken, setUsername]);


	// Function to update credentials and re-authenticate that can be called on form submissions in other components
	const setCredentials = useCallback(async (event: FormEvent<HTMLFormElement>): Promise<AuthStatus> => {
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
			drawerOpen, setDrawerOpen,
			authenticated,
			setCredentials, clearCredentials,
			queryOptions,
			currentSubjects,
			errors, setErrors,
			warningMessages, setWarningMessages,
			infoMessages, setInfoMessages
		}}>
			{children}
		</AppContext.Provider>);
};

export default AppContextProvider;
