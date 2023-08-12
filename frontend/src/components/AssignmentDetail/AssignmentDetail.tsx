import React, { FC, useContext, useState, useEffect } from 'react';
import { AssignmentDetailButtons, AssignmentDetailText, AssignmentDetailWrapper } from './AssignmentDetail.styled';
import { Assignment, AssignmentDetail } from '@server/types';
import { StyledButton } from '../Button/Button.styled.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLazyQuery } from '@apollo/client';
import { ASSIGNMENT_DETAIL_QUERY } from '../../graphql/queries.ts';
import Loading from '../Loading/Loading.tsx';
import Alert from '../Alert/Alert.tsx';
import { AppContext } from '../../context/AppContextProvider.tsx';

interface AssignmentDetailProps {
	assignment: Assignment | undefined;
}

const AssignmentDetailComponent: FC<AssignmentDetailProps> = ({ assignment }) => {
	const { queryOptions } = useContext(AppContext);
	const [getDetails] = useLazyQuery(ASSIGNMENT_DETAIL_QUERY, { fetchPolicy: 'network-only', nextFetchPolicy: 'cache-first' });
	const [loading, setLoading] = useState<boolean>(true);
	const [details, setDetails] = useState<AssignmentDetail>();
	const [inlineErrors, setInlineErrors] = useState<string[]>([]);

	useEffect(() => {
		setLoading(true);
		setInlineErrors([]);
		if(assignment) {
			const data = getDetails({
				variables: {
					projectId: assignment?.projectId,
					taskDefId: assignment?.id
				}, ...queryOptions
			}).then((response => {
				setLoading(response.loading);
				setDetails(response?.data?.assignmentDetail);
				return response?.data?.assignmentDetail;
			}));

			data.then(result => {
				if(!result) {
					setInlineErrors(['Problem loading task files']);
				}
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [assignment]);


	function downloadTaskSheet() {
		window.open(details?.taskSheetUrl, '_blank');
	}

	function downloadResources() {
		window.open(details?.taskResourcesUrl, '_blank');
	}

	return (
		<>
			{!loading && assignment &&
				<AssignmentDetailWrapper>
					<AssignmentDetailText>
						<h2>{assignment.abbreviation} {assignment.name}</h2>
						<p>{assignment.description}</p>
					</AssignmentDetailText>
					{inlineErrors && inlineErrors.map(error => {
						return (
							<Alert type="error">
								<p><strong>{error}</strong></p>
							</Alert>
						);
					})}
					{details &&
						<AssignmentDetailButtons>
							{details?.taskSheetUrl &&
								<StyledButton color="info" onClick={downloadTaskSheet}>
									Task sheet <FontAwesomeIcon icon={['fas', 'download']}/>
								</StyledButton>
							}
							{details?.taskResourcesUrl &&
								<StyledButton color="info" onClick={downloadResources}>
									Resources <FontAwesomeIcon icon={['fas', 'download']}/>
								</StyledButton>
							}
						</AssignmentDetailButtons>
					}
				</AssignmentDetailWrapper>
			}
			{loading && <Loading/>}
		</>
	);
};

export default AssignmentDetailComponent;
