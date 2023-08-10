import React, { FC, useMemo } from 'react';
import { Assignment, Subject } from '@server/types';
import { ProgressBar, ProgressBarGroup, ProgressCaption, SubjectHeading, SubjectLink } from './SubjectCard.styled.ts';
import { CardInner, CardWrapper } from '../Card.styled.ts';
import { useGradeGroupedAssignments } from '../../../hooks/useGradeGroupedAssignments.ts';
import Loading from '../../Loading/Loading.tsx';
import flatMap from 'lodash/flatMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { targetGrades } from '../../../constants.ts';
import Tooltip from '../../Tooltip/Tooltip.tsx';

interface SubjectCardProps {
    subject: Subject;
}

const SubjectCard: FC<SubjectCardProps> = ({ subject }) => {
	const { assignmentGroups, loading } = useGradeGroupedAssignments(subject.projectId, subject.targetGrade, true);

	const totalTasks: number = useMemo(() => {
		return flatMap(assignmentGroups).length;
	}, [assignmentGroups]);

	const completeTasks: number = useMemo(() => {
		const all: Assignment[] = flatMap(assignmentGroups);
		if(subject.isOnTrackUnit) {
			return all.filter((item: Assignment) => item.status === 'complete').length;
		}
		else {
			return all.filter((item: Assignment) => ['complete', 'ready_for_feedback'].includes(item.status)).length;
		}
	}, [assignmentGroups, subject.isOnTrackUnit]);

	const gradeText = targetGrades.find(grade => subject.targetGrade === grade.value)?.label;

	return (
		<>
			{loading ? <Loading /> :
				<CardWrapper>
					<CardInner>
						<SubjectHeading color={subject.color as string}>
							<span>{subject.unitCode}</span>&nbsp;{subject.name}
						</SubjectHeading>
						<ProgressBarGroup>
							<ProgressCaption>
								{subject.isOnTrackUnit && <><strong>{completeTasks}</strong> of <strong>{totalTasks}</strong> tasks completed for a {gradeText}</>}
								{!subject.isOnTrackUnit && <><strong>{completeTasks}</strong> of <strong>{totalTasks}</strong> tasks completed</>}
							</ProgressCaption>
							<div>
								{assignmentGroups && Object.entries(assignmentGroups).map(([grade, items]) => {
									const target = targetGrades.find(item => item.value === Number(grade));
									// @ts-ignore
									let complete = items.filter(item => item.status === 'complete').length;
									if(!subject.isOnTrackUnit) {
										// @ts-ignore
										complete = items.filter(item => ['complete', 'ready_for_feedback'].includes(item.status)).length;
									}
									// @ts-ignore
									const total = items.length;
									return (
										<ProgressBar key={grade} width={total/totalTasks * 100}
										             completePercentage={complete/total * 100}
										             color={subject.color as string}
										>
											<div></div>
											<ProgressCaption>
												{subject.isOnTrackUnit && <Tooltip text={`${total} ${target?.label} tasks`}/>}
												{!subject.isOnTrackUnit && <Tooltip text={`${total} standard assignments`}/>}
											</ProgressCaption>
										</ProgressBar>
									);
								})}
							</div>
						</ProgressBarGroup>
						<SubjectLink to={`/${subject.projectId}`} color={subject.color as string}>
							Details <FontAwesomeIcon icon={['fal', 'arrow-right']}/>
						</SubjectLink>
					</CardInner>
				</CardWrapper> }
		</>
	);
};

export default SubjectCard;
