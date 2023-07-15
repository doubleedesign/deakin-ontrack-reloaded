import React, { FC } from 'react';
import { Panel, Row } from '../common.styled.ts';
import { PageContent } from './SubjectPage.styled.ts';

const SubjectPage: FC = () => {
	return (
		<Panel>
			<Row>
				<PageContent>
						SubjectPage Component
				</PageContent>
			</Row>
		</Panel>
	);
};

export default SubjectPage;
