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
			setQueryOptions({
				context: {
					headers: {
						username: username,
						'auth-token': token
					}
				}
			});
		}
	}, [username, token]);

	return (
		<AppContext.Provider value={{ setCredentials, queryOptions }}>
			{children}
		</AppContext.Provider>);
};

export default AppContextProvider;
