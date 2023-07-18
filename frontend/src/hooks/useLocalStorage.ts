import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T): { value: T; setValue: Dispatch<SetStateAction<T>> } {
	const [value, setValue] = useState(() => {
		const stored = localStorage.getItem(key);
		return stored ? JSON.parse(stored) : defaultValue;
	});

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return { value, setValue };
}
