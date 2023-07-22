import React, { FC, PropsWithChildren } from 'react';
import { PageWrapper } from './Page.styled';
import Messages from '../Messages/Messages.tsx';

interface PageProps {
	color?: string;
}

const Page: FC<PropsWithChildren<PageProps>> = ({ color, children }) => {
	return (
		<PageWrapper data-component-id="Page" color={color ?? '#000'}>
			<Messages/>
			{children}
		</PageWrapper>
	);
};

export default Page;
