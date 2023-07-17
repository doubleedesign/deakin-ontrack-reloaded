import React, { FC } from 'react';
import { OverlayElement } from './Overlay.styled';

interface OverlayProps {
	open: boolean;
}

const Overlay: FC<OverlayProps> = ({ open }) => (
	<OverlayElement open={open} data-component-id="Overlay"></OverlayElement>
);

export default Overlay;
