export function formatDate(date: Date) {
	return new Intl.DateTimeFormat('ru-RU', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	}).format(date);
};