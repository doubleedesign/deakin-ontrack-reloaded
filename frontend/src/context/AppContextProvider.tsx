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
import { AuthResponse, MyQueryContext } from '../types.ts';
import { useNavigate } from 'react-router-dom';

export interface MyAppContext {
	setCredentials: (event: FormEvent<HTMLFormElement>) => void;
	clearCredentials: () => void;
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
	const [userDrawerOpen, setUserDrawerOpen] = useState<boolean>(false);
	const [getCurrentSubjects] = useLazyQuery(CURRENT_SUBJECTS_QUERY, { fetchPolicy: 'network-only', nextFetchPolicy: 'cache-first' });
	const [currentSubjects, setCurrentSubjects] = useState<Subject[]>([]);

	// Function to call auth function and update state based on its results
	const authenticate = useCallback((username: string, submittedOtToken: string, submittedDsToken: string) => {
		const result: AuthResponse = auth.authenticate(username, submittedOtToken, submittedDsToken);

		if(result.errors) {
			clearCredentials();
			setErrors(result.errors);
		}
		else {
			setUsername(result?.credentials!.username);
			setOtAuthenticated(true);
			setOtToken(result?.credentials!.otToken);
			setDsAuthenticated(true);
			setDsToken(result?.credentials!.dsToken);
			setQueryOptions(auth.setupQueryHeaders(result));
			setUserDrawerOpen(false);
		}
	}, []);

	// Function to clear auth-related state
	function clearCredentials() {
		setOtAuthenticated(false);
		setDsAuthenticated(false);
		setQueryOptions(undefined);
		setUsername('');
		setOtToken('');
		setDsToken('');

		window.location.href = '/';
	}

	// Function to update credentials and re-authenticate that can be called on form submissions in other components
	const setCredentials = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const creds = new FormData(event.currentTarget);
		const username = creds.get('username') as string;
		const otToken = creds.get('otToken') as string;
		const dsToken = creds.get('dsToken') as string;

		authenticate(username, otToken, dsToken);
	};

	// Authenticate with values saved in local storage on initial load
	useEffect(() => {
		if(username !== '' && otToken !== '' && dsToken !== '') {
			authenticate(username, otToken, dsToken);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Once auth is all sorted: fetch current subjects, assign theme colours to them, and store them
	useEffect(() => {
		if(otAuthenticated && dsAuthenticated && queryOptions) {
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
	}, [dsAuthenticated, otAuthenticated, queryOptions, getCurrentSubjects, theme]);

	return (
		<AppContext.Provider value={{
			theme, setTheme,
			userDrawerOpen, setUserDrawerOpen,
			setCredentials, clearCredentials,
			queryOptions,
			currentSubjects,
			errors, setErrors
		}}>
			{children}
		</AppContext.Provider>);
};

export default AppContextProvider;
