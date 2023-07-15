import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppContextProvider from './context/AppContextProvider.tsx';
import './global.css';
import App from './App.tsx';
import SubjectPage from './components/SubjectPage/SubjectPage.tsx';
import Dashboard from './components/Dashboard/Dashboard.tsx';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faS, faLightbulb, faListUl } from '@fortawesome/pro-solid-svg-icons';
import { fal, faLightbulbOn } from '@fortawesome/pro-light-svg-icons';
import ErrorPage from './components/ErrorPage/ErrorPage.tsx';
import UITest from './components/UITest/UITest.tsx';
library.add(fal, faS, faLightbulb, faLightbulbOn, faListUl);

const client = new ApolloClient({
	uri: 'http://localhost:5000',
	cache: new InMemoryCache(),
	connectToDevTools: true
});

const router = createBrowserRouter([
	{ path: '/', element: <App/>, children: [
		{ path: '', element: <Dashboard/> },
		{ path: ':projectId', element: <SubjectPage/>, errorElement: <ErrorPage/>, },
		{ path: 'ui', element: <UITest/> }
	] },
]);


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<AppContextProvider>
				<RouterProvider router={router}/>
			</AppContextProvider>
		</ApolloProvider>
	</React.StrictMode>,
);
