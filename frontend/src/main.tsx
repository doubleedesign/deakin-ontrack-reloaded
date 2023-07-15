import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { createBrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import AppContextProvider from './context/AppContextProvider.tsx';
import './global.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faS, faLightbulb } from '@fortawesome/pro-solid-svg-icons';
import { fal, faLightbulbOn } from '@fortawesome/pro-light-svg-icons';
import SubjectPage from './components/SubjectPage/SubjectPage.tsx';
import Dashboard from './components/Dashboard/Dashboard.tsx';
library.add(fal, faS, faLightbulb, faLightbulbOn);

const client = new ApolloClient({
	uri: 'http://localhost:5000',
	cache: new InMemoryCache(),
	connectToDevTools: true
});

const router = createBrowserRouter([
	{ path: '/', element: <Dashboard/> },
	{ path: ':projectId', element: <SubjectPage/> }
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<AppContextProvider>
				<App router={router}/>
			</AppContextProvider>
		</ApolloProvider>
	</React.StrictMode>,
);
