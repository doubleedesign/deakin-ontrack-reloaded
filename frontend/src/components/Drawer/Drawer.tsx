import React, { FC, PropsWithChildren, useRef, LegacyRef } from 'react';
import { DrawerContent, DrawerWrapper } from './Drawer.styled';
import Overlay from '../Overlay/Overlay.tsx';
import CloseButton from '../CloseButton/CloseButton.tsx';

interface DrawerProps {
	title: string;
	isOpen: boolean;
	onClose: () => void;
}

const Drawer: FC<PropsWithChildren<DrawerProps>> = ({ title, isOpen, onClose, children }) => {
	const headingRef = useRef<any>(null);

	function tabTrap(event: React.KeyboardEvent<HTMLButtonElement>) {
		event.currentTarget.addEventListener('keydown', function(anotherEvent: KeyboardEvent) {
			if(anotherEvent.key == 'Tab') {
				headingRef.current.focus();
			}
		});
	}

	return (
		<>
			<DrawerWrapper open={isOpen}>
				{isOpen &&
					<DrawerContent>
						<h2 ref={headingRef} tabIndex={0}>{title}</h2>
						{children}
						<CloseButton onClick={onClose} onKeyUp={tabTrap}/>
					</DrawerContent>
				}
			</DrawerWrapper>
			<Overlay open={isOpen} />
		</>

	);
};

export default Drawer;
