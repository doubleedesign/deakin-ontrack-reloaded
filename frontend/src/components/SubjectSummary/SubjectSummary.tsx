import { FC } from 'react';
import { Subject } from '@server/types.ts';
import { SubjectSummaryWrapper } from './SubjectSummary.styled';
import { UnitCode } from '../common.styled.ts';
import { grades } from '../../constants.ts';

interface SubjectSummaryProps {
	subject: Subject;
}

const SubjectSummary: FC<SubjectSummaryProps> = (props) => {
	const { projectId, unitId, unitCode, name, targetGrade } = props.subject;

	return (
		<SubjectSummaryWrapper>
			<div>
				<UnitCode>{unitCode}</UnitCode>
				<h2>{name}</h2>
			</div>
			<div>
				{grades[targetGrade]}
			</div>
		</SubjectSummaryWrapper>
	);
};

export default SubjectSummary;
