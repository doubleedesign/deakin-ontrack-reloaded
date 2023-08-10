import React, { FC, useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContextProvider.tsx';
import { GraphQLError } from 'graphql/error';
import { Subject } from '@server/types';
import Page from '../Page.tsx';
import { CheckboxLabel, SubjectHeaderRow, SubjectViewToggle, SubjectViewToggleRow, SubjectViewToggles } from './SubjectPage.styled.ts';
import { Col, ScreenReaderText } from '../../components/common.styled.ts';
import { LinkStyledAsButton } from '../../components/Button/Button.styled.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select, { SingleValue } from 'react-select';
import Messages from '../../components/Messages/Messages.tsx';
import { targetGrades } from '../../constants.ts';
import ButtonGroup from '../../components/ButtonGroup/ButtonGroup.tsx';
import SubjectContent from './SubjectContent.tsx';
import { SubjectViewMode } from '../../types.ts';

const SubjectPage: FC = () => {
	const params = useParams();
	const { currentSubjects, setErrors, setWarningMessages, setInfoMessages, clearMessages } = useContext(AppContext);
	const [subject, setSubject] = useState<Subject>();
	const [viewMode, setViewMode] = useState<SubjectViewMode>('date');
	const [targetGrade, setTargetGrade] = useState<SingleValue<{value: number, label: string}>>(targetGrades.find((grade => grade.value === subject?.targetGrade)) || targetGrades[2]);
	const [color, setColor] = useState<string>('#333333');
	const [showComplete, setShowComplete] = useState<boolean>(true); // only for grade mode


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
		if(subject && subject.isOnTrackUnit && subject.targetGrade) {
			// @ts-ignore
			setTargetGrade(targetGrades.find(item => item.value === subject.targetGrade));
		}
	}, [subject]);

	useEffect(() => {
		if(viewMode !== 'grade') {
			setShowComplete(false);
		}
	}, [viewMode]);


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

			<SubjectViewToggles>
				<SubjectViewToggleRow>
					{subject?.isOnTrackUnit &&
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
					}
					<SubjectViewToggle color={color}>
						<p>View by:</p>
						{subject?.isOnTrackUnit ?
							<ButtonGroup buttons={[
								{ label: 'Cluster', onClick: () => setViewMode('cluster'), active: viewMode === 'cluster' },
								{ label: 'Status', onClick: () => setViewMode('status'), active: viewMode === 'status' },
								{ label: 'Due date', onClick: () => setViewMode('date'), active: viewMode === 'date' },
								{ label: 'Target grade', onClick: () => setViewMode('grade'), active: viewMode === 'grade' },
							]}/>
							:
							<ButtonGroup buttons={[
								{ label: 'Status', onClick: () => setViewMode('status'), active: viewMode === 'status' },
								{ label: 'Due date', onClick: () => setViewMode('date'), active: viewMode === 'date' }
							]}/>
						}
					</SubjectViewToggle>
				</SubjectViewToggleRow>
				{viewMode === 'grade' &&
				<SubjectViewToggleRow>
					<SubjectViewToggle color="info">
						<CheckboxLabel htmlFor="show_complete">
							Show completed
							{showComplete ? <FontAwesomeIcon icon={['fad', 'toggle-large-on']}/> : <FontAwesomeIcon icon={['fad', 'toggle-large-off']}/>}
						</CheckboxLabel>
						<input type="checkbox" id="show_complete" name="show_complete" checked={showComplete} onChange={(event) => setShowComplete(event.target.checked)}/>
					</SubjectViewToggle>
				</SubjectViewToggleRow>
				}
			</SubjectViewToggles>

			<Messages/>

			<SubjectContent projectId={Number(params.projectId)}
			                subject={subject as Subject}
			                viewMode={viewMode}
			                targetGrade={targetGrade?.value || 2}
			                showComplete={showComplete}
			/>

		</Page>
	);
};

export default SubjectPage;
