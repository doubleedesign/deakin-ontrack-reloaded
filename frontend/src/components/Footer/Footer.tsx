import React, { FC } from 'react';
import { FooterWrapper } from './Footer.styled';

const Footer: FC = () => {
	return (
		<FooterWrapper>
			<p>Developed by <a href="https://github.com/doubleedesign/" target="_blank">Leesa Ward</a> using&nbsp;
				<a href="https://www.apollographql.com/" target="_blank">Apollo GraphQL</a>,&nbsp;
				<a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a>,&nbsp;
				<a href="https://date-fns.org/" target="_blank">date-fns</a>,&nbsp;
				<a href="https://react.dev/" target="_blank">React</a>,&nbsp;
				<a href="https://styled-components.com/" target="_blank">Styled Components</a>,&nbsp;
				<a href="https://polished.js.org/" target="_blank">Polished</a>,&nbsp;
				and various supporting tools such as <a href="https://lodash.com/" target="_blank">Lodash</a> and <a href="https://eslint.org/" target="_blank">eslint</a>.
			</p>
		</FooterWrapper>
	);
};

export default Footer;
