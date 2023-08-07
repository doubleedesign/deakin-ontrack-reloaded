import { useEffect, useMemo, useState } from 'react';

export function useVisibleSize(item: HTMLElement) {
	const [width, setWidth] = useState<number>();
	const [height, setHeight] = useState<number>();

	const observer = useMemo(() => {
		return new ResizeObserver((entries) => {
			window.requestAnimationFrame(() => {
				setWidth(entries[0].target.getBoundingClientRect().width);
				setHeight(entries[0].target.getBoundingClientRect().height);
			});
		});
	}, []);

	useEffect(() => {
		if (item) {
			observer.observe(item);

			return (): void => observer.unobserve(item);
		}
	}, [item, observer]);

	return { width, height };
}
