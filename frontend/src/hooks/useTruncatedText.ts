import { useState, useEffect, useMemo, MutableRefObject } from 'react';


function useObserverUtil(item: HTMLElement) {
	const [width, setWidth] = useState<number>();

	const observer = useMemo(() => {
		return new ResizeObserver((entries) => {
			window.requestAnimationFrame(() => {
				setWidth(entries[0].target.getBoundingClientRect().width);
			});
		});
	}, []);

	useEffect(() => {
		if (item) {
			observer.observe(item);

			return (): void => observer.unobserve(item);
		}
	}, [item, observer]);

	return { width };
}

export function useTruncatedText(outerRef: MutableRefObject<any>, innerRef: MutableRefObject<any>, deps: unknown) {
	const { width: outerWidth } = useObserverUtil(outerRef.current);
	const { width: innerWidth } = useObserverUtil(innerRef.current);

	useEffect(() => {
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
