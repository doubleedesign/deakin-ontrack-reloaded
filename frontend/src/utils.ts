export function slugify(text: string) {
	return text.replace(/\s/g, '-').toLowerCase();
}

export function ucfirst(text: string) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}
