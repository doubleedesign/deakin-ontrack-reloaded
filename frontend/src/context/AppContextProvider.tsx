import {
	createContext,
	useState,
	useEffect,
	FC,
	PropsWithChildren,
	FormEvent
} from 'react';

export interface MyAppContext {
	setCredentials: (event: FormEvent<HTMLFormElement>) => void;
	authenticated: boolean;
	queryOptions: MyQueryContext | undefined
}
export const AppContext = createContext({} as MyAppContext);

interface MyCredentials {
	username: string | undefined;
	'auth-token': string | undefined;
}

interface MyQueryContext {
	context: {
		headers: MyCredentials
	}
}

const AppContextProvider: FC<PropsWithChildren> = function({ children }) {
	const [username, setUsername] = useState<string>();
	const [authenticated, setAuthenticated] = useState<boolean>(false);
	const [token, setToken] = useState<string>();
	const [queryOptions, setQueryOptions] = useState<MyQueryContext | undefined>(undefined);
	const setCredentials = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const creds = new FormData(event.currentTarget);
		setUsername(creds.get('username') as string);
		setToken(creds.get('token') as string);
	};

	useEffect(() => {
		if(username && token) {
			// Hit an endpoint that requires authentication but doesn't return much data, just to see if I can
			// TODO: Handle the mock API - only require auth if really accessing OnTrack
			fetch('https://ontrack.deakin.edu.au/api/unit_roles', {
				method: 'GET',
				headers: {
					username: username,
					'auth-token': token
				} })
				.then(response => {
					if(response.status === 200) {
						setAuthenticated(true);
					}
					else {
						throw new Error(`Error authenticating with OnTrack. ${response.statusText}`);
					}
				})
				.catch(error => {
					// TODO: User feedback
					console.error(error);
				});
		}
		else {
			// TODO: User feedback
			console.error('Fill in ya creds!');
		}
	}, [username, token]);

	useEffect(() => {
		if(authenticated) {
			setQueryOptions({
				context: {
					headers: {
						username: username,
						'auth-token': token
					}
				}
			});
		}
	}, [authenticated]);

	return (
		<AppContext.Provider value={{ setCredentials, authenticated, queryOptions }}>
			{children}
		</AppContext.Provider>);
};

export default AppContextProvider;
