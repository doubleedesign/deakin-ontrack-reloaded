import React, { FC, useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../context/AppContextProvider.tsx';
import { GraphQLError } from 'graphql/error';
import { Subject } from '@server/types.ts';
import Page from '../Page.tsx';
import { SubjectHeaderRow, SubjectViewToggle, SubjectViewToggleRow } from './SubjectPage.styled.ts';
import { Col, Row, ScreenReaderText } from '../../common.styled.ts';
import { LinkStyledAsButton, StyledButton } from '../../Button/Button.styled.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select, { SingleValue } from 'react-select';
import Messages from '../../Messages/Messages.tsx';
import StatusGroupedAssignments from './StatusGroupedAssignments/StatusGroupedAssignments.tsx';
import ClusteredAssignments from './ClusteredAssignments/ClusteredAssignments.tsx';
import DateGroupedAssignments from './DateGroupedAssignments/DateGroupedAssignments.tsx';

const targetGrades = [
	{ value: 0, label: 'Pass' },
	{ value: 1, label: 'Credit' },
	{ value: 2, label: 'Distinction' },
	{ value: 3, label: 'High Distinction' },
];

const SubjectPage: FC = () => {
	const params = useParams();
	const { currentSubjects, setErrors, setWarningMessages, setInfoMessages } = useContext(AppContext);
	const [subject, setSubject] = useState<Subject>();
	const [viewMode, setViewMode] = useState<'status'|'cluster'|'date'>('cluster');
	const [targetGrade, setTargetGrade] = useState<SingleValue<{value: number, label: string}>>(targetGrades.find((grade => grade.value === subject?.targetGrade)) || targetGrades[2]);
	const [color, setColor] = useState<string>('#333333');

	useEffect(() => {
		setWarningMessages([]);
		setInfoMessages([]);
		setErrors([]);
		if(params.projectId && currentSubjects) {
			// @ts-ignore
			const found = currentSubjects.find(subject => subject.projectId.toString() === params.projectId.toString());
			if(found) {
				setSubject(found);
				if(found.color) {
					setColor(found.color);
				}
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
	}, [params, currentSubjects, setErrors, setWarningMessages, setInfoMessages]);

	useEffect(() => {
		if(subject && subject.targetGrade) {
			// @ts-ignore
			setTargetGrade(targetGrades.find(item => item.value === subject.targetGrade));
		}
	}, [subject]);


	return (
		<Page color={subject?.color}>
			<SubjectHeaderRow color={subject?.color ?? '#000'}>
				<Col>
					<h2><span>{subject?.unitCode}</span> {subject?.name}</h2>
				</Col>
				<Col>
					{subject?.urls.map(url => {
						return (
							<LinkStyledAsButton key={url.label}
							                    href={url.url}
							                    target="_blank"
							                    color={url.label === 'OnTrack' ? 'logo' : 'reverseSubtle'}
							>
								{url.label}
								<FontAwesomeIcon icon={['fas', 'arrow-up-right-from-square']}/>
								<ScreenReaderText>(opens in a new tab)</ScreenReaderText>
							</LinkStyledAsButton>
						);
					})}
				</Col>
			</SubjectHeaderRow>

			<SubjectViewToggleRow>
				<SubjectViewToggle color={color} current={targetGrade?.value}>
					<p>Target grade:</p>
					<Select
						value={targetGrade}
						onChange={(selected) => setTargetGrade(selected)}
						options={targetGrades}
						className="selectBox"
						unstyled
					/>
				</SubjectViewToggle>
				<SubjectViewToggle color={color}>
					<p>View by:</p>
					<StyledButton color={viewMode === 'status' ? color : '#dedede'} onClick={() => setViewMode('status')}>Status</StyledButton>
					<StyledButton color={viewMode === 'cluster' ? color : '#dedede'} onClick={() => setViewMode('cluster')}>Cluster</StyledButton>
					<StyledButton color={viewMode === 'date' ? color : '#dedede'} onClick={() => setViewMode('date')}>Due date</StyledButton>
				</SubjectViewToggle>
			</SubjectViewToggleRow>

			<Messages/>

			{viewMode === 'status' && <StatusGroupedAssignments projectId={Number(params.projectId)} targetGrade={targetGrade?.value || 2}/>}
			{subject && viewMode === 'cluster' && <ClusteredAssignments subject={subject} targetGrade={targetGrade?.value || 2}/>}
			{subject && viewMode === 'date' && <DateGroupedAssignments projectId={Number(params.projectId)} targetGrade={targetGrade?.value || 2}/>}
		</Page>
	);
};

export default SubjectPage;
