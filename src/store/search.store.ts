import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/api/api";
import { IArticle, IArticleCard, ISearchResult } from '@/store/types'
import { siteConfig } from "@/config/site.config";
import { filterUniqueArticles } from '@/utils/utils'

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
	date: DateSearchPeriod;
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

	setSearchParams: (params: SearchParams) => void;

	getSearchResults: () => Promise<null>;
	loadMore: () => Promise<void>;     // ← добавлено

	getSearchingHistory: () => null;
	setSearchingHistory: (history: string[]) => null;
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
		
		setSearchingHistory: (history: string[]) => {
			set({ searchingHistory: history });
		},

		setSearchParams: (params: SearchParams) => {
			const cleaned: Record<string, any> = convertURLParamsToRecord(params);
			
			if (params.date === DateSearchPeriod.none) {
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
			
			set({
				searchParams: params
			})
		},

		// === ПЕРВАЯ ЗАГРУЗКА ===
		getSearchResults: async () => {
			const { searchParams } = get();

			try {
				set({
					isLoading: true,
					error: null,
					offset: 0
				});

				// MOCK режим
				if (siteConfig.showMockData) {
					await new Promise(res => setTimeout(res, 500));

					const mock: ISearchResult = {
						articles: filterUniqueArticles([
							{
								id: "mock-1",
								title: "Mock Article 1",
								tags: ["frontend", "react"],
								creation_date: new Date(),
								source: "https://habr.com/",
								summary: "Lorem ipsum."
							},
						]),
						summarize: "Моковые данные"
					};

					set({
						searchResults: mock,
						offset: mock.articles.length
					});

					return;
				}

				// → Всегда ставим limit = 50
				const { data } = await api.get<IArticleCard[]>(
					`/v1/articles/search`,
					{
						params: {
							...searchParams,
							offset: 0,
							limit: 50,
						}
					}
				);

				const unique = filterUniqueArticles(data);

				set({
					searchResults: { articles: unique, summarize: "" },
					offset: unique.length
				});

			} catch {
				set({ error: "Ошибка при получении результатов поиска" });
			} finally {
				set({ isLoading: false });
			}

			return null;
		},


		// === ДОГРУЗКА СТАТЕЙ === + костыль :)
		loadMore: async () => {
			const {
				searchParams,
				searchResults,
				offset,
				isLoading
			} = get();

			if (isLoading) return;
			if (!searchResults) return;

			try {
				set({ isLoading: true });

				// MOCK режим
				if (siteConfig.showMockData) {
					await new Promise(res => setTimeout(res, 500));

					const extra = filterUniqueArticles([
						{
							id: "mock-extra",
							title: "Next mock",
							tags: ["nextjs"],
							creation_date: new Date(),
							source: "https://dev.to/",
							summary: "extra."
						}
					]);

					const merged = filterUniqueArticles([
						...searchResults.articles,
						...extra
					]);

					set({
						searchResults: {
							...searchResults,
							articles: merged
						},
						offset: merged.length
					});

					return;
				}

				// → limit = 50 всегда
				const { data } = await api.get<IArticleCard[]>(
					`/v1/articles/search`,
					{
						params: {
							...searchParams,
							offset,
							limit: 50
						}
					}
				);

				const merged = filterUniqueArticles([
					...searchResults.articles,
					...data
				]);

				set({
					searchResults: {
						...searchResults,
						articles: merged
					},
					offset: merged.length
				});

			} catch {
				set({ error: "Ошибка при пагинации" });
			} finally {
				set({ isLoading: false });
			}
		},


		getSearchingHistory: () => {
			
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
						creation_date: new Date(),
						source: "https://habr.com/",
						text: "Т-Инвестиции упростили доступ к российскому фондовому рынку для клиентов-иностранных граждан. Теперь нерезиденты-владельцы карты Black смогут открыть брокерский счет удаленно — без повторной встречи с представителем банка — и сразу начать инвестировать с суммой от 10 рублей. "
					} as IArticle
				}
				
				
				const { data } = await api.get<IArticle>(`/v1/articles/${id}`);
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
		dateSearchPeriod: params.date,
		sourceType: params.sourceType
	}
}