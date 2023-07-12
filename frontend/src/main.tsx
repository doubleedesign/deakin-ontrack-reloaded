import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import AppContextProvider from './context/AppContextProvider.tsx';

const client = new ApolloClient({
	uri: 'http://localhost:5000',
	cache: new InMemoryCache(),
	connectToDevTools: true
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<AppContextProvider>
			<ApolloProvider client={client}>
				<App />
			</ApolloProvider>
		</AppContextProvider>
	</React.StrictMode>,
);
