import React, { FC, useState, useMemo, useCallback } from 'react';
import { Assignment } from '@server/types';
import AssignmentCard from '../../../components/Card/AssignmentCard/AssignmentCard.tsx';
import { AssignmentsSummarySection, AssignmentsSummaryRow, ActionsRow } from './AssignmentsSummary.styled.ts';
import chunk from 'lodash/chunk';
import { Row } from '../../../components/common.styled.ts';
import IconForStatus from '../../../components/IconForStatus/IconForStatus.tsx';
import { getColorForStatus } from '../../../utils.ts';
import { StyledButton } from '../../../components/Button/Button.styled.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface AssignmentsSummaryProps {
	status: string;
	items: Assignment[];
}

const AssignmentsSummary: FC<AssignmentsSummaryProps> = ({ status, items }) => {
	const total: number = items.length;
	const perRow: number = 3;
	const chunks = chunk(items, perRow);
	const [visible, setVisible] = useState(chunks[0]);
	const [count, setCount] = useState<number>(0);

	const heading = useMemo(() => {
		switch(status) {
			case 'overdue':
				return 'Overdue';
			case 'tomorrow':
				return 'Due today & tomorrow';
			case 'later':
				return <>Coming up <span>(next 2 weeks)</span></>;
			default:
				return '';
		}
	}, [status]);

	const increaseVisible = useCallback(() => {
		setVisible(visible.concat(chunks[count+1]));
		setCount(count + 1);
	}, [chunks, count, visible]);

	return (
		<AssignmentsSummarySection status={status}>
			<Row>
				<h2><IconForStatus status={status}/> {heading}</h2>
				<AssignmentsSummaryRow>
					{visible.map((assignment: Assignment) => {
						return <AssignmentCard key={assignment.id} assignment={assignment} showSubject={true}/>;
					})}
				</AssignmentsSummaryRow>
				{(total > perRow) &&
					<ActionsRow>
						<span>Showing {visible.length} of {total}</span>
						{(total > visible.length) &&
							<StyledButton color={getColorForStatus(status)} onClick={increaseVisible}>Load more <FontAwesomeIcon icon={['fas', 'angle-down']}/></StyledButton>
						}
					</ActionsRow>
				}
			</Row>
		</AssignmentsSummarySection>
	);
};

export default AssignmentsSummary;
