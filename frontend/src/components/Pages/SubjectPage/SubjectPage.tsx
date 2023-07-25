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
import GradeGroupedAssignments from './GradeGroupedAssignments/GradeGroupedAssignments.tsx';
import { targetGrades } from '../../../constants.ts';
import ButtonGroup from '../../ButtonGroup/ButtonGroup.tsx';



const SubjectPage: FC = () => {
	const params = useParams();
	const { currentSubjects, setErrors, setWarningMessages, setInfoMessages, clearMessages } = useContext(AppContext);
	const [subject, setSubject] = useState<Subject>();
	const [viewMode, setViewMode] = useState<'status'|'cluster'|'date'|'grade'>('cluster');
	const [targetGrade, setTargetGrade] = useState<SingleValue<{value: number, label: string}>>(targetGrades.find((grade => grade.value === subject?.targetGrade)) || targetGrades[2]);
	const [color, setColor] = useState<string>('#333333');

	useEffect(() => {
		clearMessages();
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
					<ButtonGroup buttons={[
						{ label: 'Cluster', onClick: () => setViewMode('cluster'), active: viewMode === 'cluster' },
						{ label: 'Status', onClick: () => setViewMode('status'), active: viewMode === 'status' },
						{ label: 'Due date', onClick: () => setViewMode('date'), active: viewMode === 'date' },
						{ label: 'Target grade', onClick: () => setViewMode('grade'), active: viewMode === 'grade' },
					]}/>
				</SubjectViewToggle>
			</SubjectViewToggleRow>

			<Messages/>

			{subject && viewMode === 'cluster' && <ClusteredAssignments subject={subject} targetGrade={targetGrade?.value || 2}/>}
			{viewMode === 'status' && <StatusGroupedAssignments projectId={Number(params.projectId)} targetGrade={targetGrade?.value || 2}/>}
			{viewMode === 'date' && <DateGroupedAssignments projectId={Number(params.projectId)} targetGrade={targetGrade?.value || 2}/>}
			{viewMode === 'grade' && <GradeGroupedAssignments projectId={Number(params.projectId)} targetGrade={targetGrade?.value || 2}/>}
		</Page>
	);
};

export default SubjectPage;
