import { useEffect, MutableRefObject } from 'react';
import { useVisibleSize } from './useVisibleSize.ts';

export function useTruncatedText(outerRef: MutableRefObject<any>, innerRef: MutableRefObject<any>) {
	const { width: outerWidth } = useVisibleSize(outerRef.current);
	const { width: innerWidth } = useVisibleSize(innerRef.current);

	useEffect(() => {
		if(innerRef.current) {
			innerRef.current.style.whiteSpace = 'nowrap';
		}

		// They may be undefined so this is checking first if they exist before the comparison
		// Could be shortened to innerwidth && outerWidth && (innerWidth > outerWidth) but that's not very readable now is it?
		// (PHP does some things well, ok? if(isset(innerWidth)), now that's some readable syntax)
		if(typeof innerWidth !== 'undefined' && typeof outerWidth !== 'undefined' && (innerWidth > outerWidth)) {
			innerRef.current.style.width = outerWidth;
			innerRef.current.style.overflowX = 'hidden';
			innerRef.current.style.textOverflow = 'ellipsis';
		}
	}, [outerWidth, innerWidth, innerRef]);

	return true;
}
