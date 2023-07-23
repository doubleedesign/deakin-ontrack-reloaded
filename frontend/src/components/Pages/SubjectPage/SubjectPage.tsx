import React, { FC, useContext, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../../context/AppContextProvider.tsx';
import { GraphQLError } from 'graphql/error';
import { Assignment, Subject } from '@server/types.ts';
import Page from '../Page.tsx';
import { SubjectHeaderRow } from './SubjectPage.styled.ts';
import { Col, Row, ScreenReaderText } from '../../common.styled.ts';
import { LinkStyledAsButton } from '../../Button/Button.styled.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSortedAssignments } from '../../../hooks/useSortedAssignments.ts';
import Card from '../../Card/Card.tsx';
import DateTag from '../../DateTag/DateTag.tsx';
import { getColorForStatus, object_key_first, ucfirst } from '../../../utils.ts';
import { TabSection, TabNav, TabNavList, TabNavItem, TabNavButton, TabContent, TabPanels } from '../../Tabs/Tabs.styled.ts';
import DateInterval from '../../DateInterval/DateInterval.tsx';
import IconForStatus from '../../IconForStatus/IconForStatus.tsx';

const SubjectPage: FC = () => {
	const params = useParams();
	const { currentSubjects, setErrors } = useContext(AppContext);
	const [subject, setSubject] = useState<Subject>();
	const { assignmentGroups } = useSortedAssignments(Number(params.projectId));
	const [openTab, setOpenTab] = useState<string>('');

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

	useEffect(() => {
		if(assignmentGroups) {
			// @ts-ignore
			setOpenTab(object_key_first(assignmentGroups));
		}
	}, [assignmentGroups]);


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
			<TabSection id="assignmentTabs">
				<TabNav>
					<TabNavList>
						{assignmentGroups && Object.keys(assignmentGroups).map(key => {
							return (
								<TabNavItem key={key}>
									<TabNavButton tabKey={key} color={getColorForStatus(key)} aria-selected={openTab === key} onClick={() => setOpenTab(key)}>
										<IconForStatus status={key}/>
										{ucfirst(key.replaceAll('_', ' '))}
									</TabNavButton>
								</TabNavItem>
							);
						})}
					</TabNavList>
				</TabNav>
				<TabPanels>
					{assignmentGroups && Object.entries(assignmentGroups).map(([status, assignments]) => {
						return (
							<TabContent key={status} tabKey={status} open={openTab === status}>
								<Row>
									{(assignments as Assignment[]).map((assignment: Assignment) => {
										return (
											<Card key={assignment.id}
											      title={`${assignment.abbreviation} ${assignment.name}`}
											      status={assignment.status}
											      dueDate={assignment.due_date}
											>
												<p>{assignment.description}</p>
											</Card>
										);
									})}
								</Row>
							</TabContent>
						);
					})}
				</TabPanels>
			</TabSection>
		</Page>
	);
};

export default SubjectPage;
