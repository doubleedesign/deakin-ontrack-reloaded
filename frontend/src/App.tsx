import { useState, useContext, useEffect } from 'react';
import { CURRENT_SUBJECTS_QUERY } from './graphql/queries.ts';
import { useLazyQuery } from '@apollo/client';
import { AppContext } from './context/AppContextProvider.tsx';
import { Subject } from '@server/types.ts';
import SubjectSummary from './components/SubjectSummary/SubjectSummary.tsx';
import Header from './components/Header/Header.tsx';
import Alert from './components/Alert/Alert.tsx';
import { AppWrapper, Row } from './components/common.styled.ts';
import { lightTheme, darkTheme } from './theme.ts';
import { ThemeProvider } from 'styled-components';

function App() {
	const { theme, authenticated, queryOptions, errors, setErrors } = useContext(AppContext);
	const [getCurrentSubjects] = useLazyQuery(CURRENT_SUBJECTS_QUERY, { fetchPolicy: 'network-only', nextFetchPolicy: 'cache-first' });
	const [currentSubjects, setCurrentSubjects] = useState<Subject[]>();

	useEffect(() => {
		if(authenticated && queryOptions) {
			getCurrentSubjects(queryOptions).then(response => {
				if (response.data) {
					setCurrentSubjects(response.data.currentSubjects);
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
	}, [authenticated, queryOptions]);

	return (
		<ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
			<AppWrapper>
				<Header/>
				<Row>
					{errors && errors.map((error, index) => {
						console.error(`${error.extensions?.code} ${error.message} ${error.extensions?.stacktrace as string}`);
						return (
							<Alert key={`error-${index}`}
							       message={`${error.extensions?.code} ${error.message}`}
							       more={error.extensions?.note as string}
							/>
						);
					})}

					{currentSubjects && currentSubjects.map(subject => {
						return <SubjectSummary key={subject.projectId} subject={subject}/>;
					})}
				</Row>
			</AppWrapper>
		</ThemeProvider>
	);
}

export default App;
