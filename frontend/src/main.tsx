import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppContextProvider from './context/AppContextProvider.tsx';
import './global.css';
import App from './App.tsx';
import SubjectPage from './components/Pages/SubjectPage/SubjectPage.tsx';
import Dashboard from './components/Pages/Dashboard/Dashboard.tsx';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faS, faLightbulb, faListUl, faUserGear, faArrowUpRightFromSquare, faCircleCheck, faCircleExclamation, faTriangleExclamation, faWrench } from '@fortawesome/pro-solid-svg-icons';
import { fal, faLightbulbOn, faXmark } from '@fortawesome/pro-light-svg-icons';
import { faD, faLoader, faComments, faCommentsQuestion } from '@fortawesome/pro-duotone-svg-icons';
import ErrorPage from './components/Pages/ErrorPage/ErrorPage.tsx';
import UITest from './components/Pages/UITest/UITest.tsx';
library.add(fal, faS, faD, faLightbulb, faLightbulbOn, faListUl, faXmark, faUserGear, faArrowUpRightFromSquare, faCircleCheck, faCircleExclamation, faTriangleExclamation, faLoader, faComments, faWrench, faCommentsQuestion);

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
