import React, { FC, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContextProvider.tsx';
import { GraphQLError } from 'graphql/error';
import { Subject } from '@server/types.ts';
import Page from '../Page/Page.tsx';
import { SubjectHeaderRow } from './SubjectPage.styled.ts';
import { Col } from '../common.styled.ts';

const SubjectPage: FC = () => {
	const params = useParams();
	const { currentSubjects, setErrors } = useContext(AppContext);
	const [subject, setSubject] = useState<Subject>();

	useEffect(() => {
		if(params.projectId && currentSubjects) {
			// @ts-ignore
			const found = currentSubjects.find(subject => subject.projectId.toString() === params.projectId.toString());
			if(found) {
				setSubject(found);
				setErrors([]);
			}
			else {
				setErrors([new GraphQLError(`Subject ${params.projectId} not found`, {
					extensions: {
						code: 404,
						stacktrace: './frontend/src/components/SubjectPage/SubjectPage.tsx'
					}
				})]);
			}
		}
	}, [params, currentSubjects, setErrors]);

	return (
		<Page color={subject?.color}>
			<SubjectHeaderRow color={subject?.color ?? '#000'}>
				<Col>
					<h2><span>{subject?.unitCode}</span> {subject?.name}</h2>
				</Col>
			</SubjectHeaderRow>
		</Page>
	);
};

export default SubjectPage;
