import React, { FC, useContext, useState, useEffect } from 'react';
import { Panel, Row } from '../common.styled.ts';
import { PageContent } from './SubjectPage.styled.ts';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContextProvider.tsx';
import { GraphQLError } from 'graphql/error';
import { Subject } from '@server/types.ts';

const SubjectPage: FC = () => {
	const params = useParams();
	const { currentSubjects, setErrors } = useContext(AppContext);
	const navigate = useNavigate();
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
	}, [params, currentSubjects]);

	return (
		<Row>
			<PageContent>

			</PageContent>
		</Row>
	);
};

export default SubjectPage;
