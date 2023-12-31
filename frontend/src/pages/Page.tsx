import React, { FC, PropsWithChildren } from 'react';
import { PageWrapper } from './Page.styled.ts';

interface PageProps {
	color?: string;
}

const Page: FC<PropsWithChildren<PageProps>> = ({ color, children }) => {
	return (
		<PageWrapper data-component-id="Page" color={color ?? '#000'}>
			{children}
		</PageWrapper>
	);
};

export default Page;
