import React, { FC, ReactNode, RefObject, useRef, useState, useEffect } from 'react';
import { DrawerContent, DrawerWrapper } from './Drawer.styled';
import Overlay from '../Overlay/Overlay.tsx';
import CloseButton from '../Button/CloseButton/CloseButton.tsx';
import { DrawerStatus } from '../../types.ts';
import LoginForm from '../Form/LoginForm/LoginForm.tsx';
import Notifications from '../Notifications/Notifications.tsx';
import { ucfirst } from '../../utils.ts';

interface DrawerProps {
	hasContent: DrawerStatus;
	onClose: () => void;
}

const Drawer: FC<DrawerProps> = ({ hasContent, onClose }) => {
	const heading = hasContent ? ucfirst(hasContent) : '';
	const headingRef: RefObject<HTMLHeadingElement> = useRef<HTMLHeadingElement>(null);
	const [content, setContent] = useState<ReactNode>();

	useEffect(() => {
		if(hasContent === 'settings') {
			setContent(<LoginForm/>);
		}
		else if(hasContent === 'notifications') {
			setContent(<Notifications/>);
		}
		else {
			setContent(<div></div>);
		}
	}, [hasContent]);

	function tabTrap(event: React.KeyboardEvent<HTMLButtonElement>) {
		event.currentTarget.addEventListener('keydown', function(anotherEvent: KeyboardEvent) {
			if(anotherEvent.key == 'Tab' && headingRef.current) {
				headingRef.current.focus();
			}
		});
	}

	return (
		<>
			<DrawerWrapper open={!!hasContent}>
				{hasContent &&
					<DrawerContent>
						<h2 ref={headingRef} tabIndex={0}>{heading}</h2>
						{content}
						<CloseButton onClick={onClose} onKeyUp={tabTrap}/>
					</DrawerContent>
				}
			</DrawerWrapper>
			<Overlay open={!!hasContent} />
		</>

	);
};

export default Drawer;
