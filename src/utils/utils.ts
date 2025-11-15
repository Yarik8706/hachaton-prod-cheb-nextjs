import { IArticleCard } from '@/store/types'

export function normalize(text: string) {
	return text.trim().toLowerCase();
}

export function loadHistory(): string[] {
	const raw = localStorage.getItem("search-history");
	if (!raw) return [];
	try {
		return JSON.parse(raw);
	} catch {
		return [];
	}
}

export function filterUniqueArticles(arr: IArticleCard[]): IArticleCard[] {
	const seen = new Set<string>();
	const result: IArticleCard[] = [];

	for (const a of arr) {
		if (!a.title) continue;

		const key = a.title.length > 10
			? a.title.slice(0, 10).toLowerCase()
			: a.title.toLowerCase();

		if (!seen.has(key)) {
			seen.add(key);
			result.push(a);
		}
	}

	return result.slice(0, 15); // максимум 15 уникальных
}

export function getLastQuery(): string | null {
	const history = loadHistory();
	return history[0] || null;
}

export function saveQuery(query: string) {
	
	const lastQuery = getLastQuery();
	const normalized = normalize(query);

	if (!normalized || lastQuery != undefined && lastQuery?.length - normalized.length > 2) return;

	const history = loadHistory();

	// Удаляем все похожие по нормализованному виду
	const filtered = history.filter(
		(item) => normalize(item) !== normalized
	);

	// Записываем только новый главный запрос
	const updated = [query, ...filtered];

	localStorage.setItem("search-history", JSON.stringify(updated));
}