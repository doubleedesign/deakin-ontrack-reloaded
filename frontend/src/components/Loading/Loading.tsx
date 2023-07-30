import React, { FC } from 'react';
import { LoadingWrapper } from './Loading.styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import sampleSize from 'lodash/sampleSize';
import { loadingMessages } from './LoadingMessages.ts';
import { ScreenReaderText } from '../common.styled.ts';

const Loading: FC = () => {
	const message = sampleSize(loadingMessages, 1);
	return (
		<LoadingWrapper data-component-id="Loading">
			<div>
				<FontAwesomeIcon icon={['fad', 'gear']} spin/>
				<FontAwesomeIcon icon={['fad', 'gear']} spin spinReverse/>
			</div>
			<p aria-hidden="true">{message}</p>
			<ScreenReaderText>Content is loading</ScreenReaderText>
		</LoadingWrapper>
	);
};

export default Loading;
