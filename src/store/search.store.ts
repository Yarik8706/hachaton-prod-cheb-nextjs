import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/api/api";
import { IArticle, IArticleCard, ISearchResult } from '@/store/types'
import { siteConfig } from "@/config/site.config";

export enum SourceType {
	Habr,
	Devto,
	Medium,
	All,
}

export enum DateSearchPeriod {
	day,
	month,
	year,
	none,
}

export interface SearchParams {
	text: string;
	tags: string[];
	dateSearchPeriod: DateSearchPeriod;
	sourceType: SourceType;
}

interface SearchStore {
	isLoading: boolean;
	error: string | null;

	searchParams: SearchParams | null;
	searchingHistory: string[];
	searchResults: ISearchResult | null;

	offset: number;      // ← добавлено
	limit: number;       // ← добавлено
	lastId: string | null;  // ← добавлено

	setSearchParams: (params: SearchParams) => void;

	getSearchResults: () => Promise<null>;
	loadMore: () => Promise<void>;     // ← добавлено

	getSearchingHistory: () => Promise<null>;
	getArticleById: (id: string) => Promise<IArticle | null>;
}

export const useArticleSearch = create<SearchStore>()(
	devtools((set, get) => ({
		isLoading: false,
		error: null,

		searchParams: null,
		searchingHistory: [],
		searchResults: null,

		offset: 0,
		limit: 10,
		lastId: null,

		setSearchParams: (params: SearchParams) => {
			const cleaned: Record<string, any> = convertURLParamsToRecord(params);

			if (params.dateSearchPeriod === DateSearchPeriod.none) {
				delete cleaned.dateSearchPeriod;
			}

			if (params.sourceType === SourceType.All) {
				delete cleaned.sourceType;
			}

			if (!params.tags || params.tags.length === 0) {
				delete cleaned.tags;
			}

			if (!params.text || params.text.trim() === "") {
				delete cleaned.text;
			}

			const search = new URLSearchParams(window.location.search);

			Object.keys(params).forEach((key) => {
				if (cleaned[key] === undefined || cleaned[key] === null) {
					search.delete(key);
				} else {
					search.set(key, String(cleaned[key]));
				}
			});

			const newUrl = `${window.location.pathname}?${search.toString()}`;
			window.history.replaceState(null, "", newUrl);
		},

		// === ПЕРВАЯ ЗАГРУЗКА ===
		getSearchResults: async () => {
			const { searchParams, limit } = get();

			try {
				set({
					isLoading: true,
					error: null,
					offset: 0,
					lastId: null
				});

				// MOCK режим
				if (siteConfig.showMockData) {
					await new Promise(res => setTimeout(res, 500));

					const mock: ISearchResult = {
						articles: [
							{
								id: "mock-1",
								title: "Mock Article 1",
								tags: ["frontend", "react"],
								onDateCreated: new Date(),
								source: "https://habr.com/",
								summary: "Lorem ipsum..."
							},
						],
						summarize: "Моковые данные"
					};

					set({
						searchResults: mock,
						offset: mock.articles.length,
						lastId: mock.articles.at(-1)?.id || null,
					});

					return;
				}

				const { data } = await api.get<ISearchResult>(
					`/api/v1/search`, {
						params: {
							...searchParams,
							offset: 0,
							limit
						}
					});

				set({
					searchResults: data,
					offset: data.articles.length,
					lastId: data.articles.at(-1)?.id || null
				});
			} catch {
				set({ error: "Ошибка при получении результатов поиска" });
			} finally {
				set({ isLoading: false });
			}

			return null;
		},

		// === ДОГРУЗКА СТАТЕЙ ===
		loadMore: async () => {
			const {
				searchParams,
				searchResults,
				offset,
				limit,
				lastId,
				isLoading
			} = get();

			if (isLoading) return;
			if (!searchResults) return;

			try {
				set({ isLoading: true });

				// MOCK режим
				if (siteConfig.showMockData) {
					await new Promise(res => setTimeout(res, 500));

					const extra: IArticleCard[] = [
						{
							id: "mock-extra",
							title: "Next mock",
							tags: ["nextjs"],
							onDateCreated: new Date(),
							source: "https://dev.to/",
							summary: "extra..."
						}
					];

					set({
						searchResults: {
							...searchResults,
							articles: [...searchResults.articles, ...extra]
						},
						offset: offset + extra.length,
						lastId: extra.at(-1)?.id || lastId,
					});

					return;
				}

				const { data } = await api.get<ISearchResult>(
					`/api/v1/search`,
					{
						params: {
							...searchParams,
							offset,
							limit,
							lastId
						}
					}
				);

				const merged = [
					...searchResults.articles,
					...data.articles
				];

				set({
					searchResults: {
						...searchResults,
						articles: merged
					},
					offset: merged.length,
					lastId: merged.at(-1)?.id || null,
				});

			} catch {
				set({ error: "Ошибка при пагинации" });
			} finally {
				set({ isLoading: false });
			}
		},

		getSearchingHistory: async () => {
			try {
				if (siteConfig.showMockData) {
					await new Promise(res => setTimeout(res, 500));

					const mockHistory = ["react", "zustand", "api", "frontend"];
					set({ searchingHistory: mockHistory });
					return mockHistory;
				}

				const { data } = await api.get<string[]>(`/api/v1/search/history`);
				set({ searchingHistory: data });
				return null;
			} catch {
				set({ error: "Ошибка при загрузке истории поиска" });
				return null;
			}
		},

		getArticleById: async (id: string) => {
			try {
				set({ isLoading: true });
				if (siteConfig.showMockData) {
					await new Promise(res => setTimeout(res, 500));
					
					return {
						id: "mock-1",
						title: "Mock Article 1",
						tags: ["frontend", "react"],
						onDateCreated: new Date(),
						source: "https://habr.com/",
						text: "Т-Инвестиции упростили доступ к российскому фондовому рынку для клиентов-иностранных граждан. Теперь нерезиденты-владельцы карты Black смогут открыть брокерский счет удаленно — без повторной встречи с представителем банка — и сразу начать инвестировать с суммой от 10 рублей. "
					} as IArticle
				}
				
				
				const { data } = await api.get<IArticle>(`/api/v1/articles/${id}`);
				return data;
			} catch {
				set({ error: "Ошибка при получении статьи" });
				return null;
			}
			finally {
				set({ isLoading: false });
			}
		}
	}))
);


export function convertURLParamsToRecord(params : SearchParams) {
	return {
		text: params.text,
		tags: params.tags,
		dateSearchPeriod: params.dateSearchPeriod,
		sourceType: params.sourceType
	}
}