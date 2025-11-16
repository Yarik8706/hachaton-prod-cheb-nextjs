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
        search_text: string | undefined;
        tags: string[] | undefined;
        date: DateSearchPeriod | undefined;
        sourceType: SourceType | undefined;
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
			const cleaned = {
				...params,
				...convertURLParamsToRecord(params)
			};
			const search = new URLSearchParams(window.location.search);


			search.delete("search_text");
			search.delete("date");
			search.delete("source");
			search.delete("tags");
			
			if (cleaned.search_text !== undefined) {
				console.log("clear text")
				search.delete("search_text");
				search.set("search_text", cleaned.search_text);
			} else {
				search.delete("search_text");
			}

			if (cleaned.date) {
				search.delete("date");
				search.set("date", cleaned.date);
			}

			if (cleaned.source) {
				search.delete("source");
				search.set("source", cleaned.source);
			}

			if (cleaned.tags) search.delete("tags");

			cleaned.tags?.forEach(tag => search.append("tags", tag));

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
				const params = buildSearchQueryParams(searchParams, 0, 50);

				const { data } = await api.get<IArticleCard[]>(
					`/v1/articles/search`,
					{
						params,
						paramsSerializer: (params) => params.toString(),
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
				const params = buildSearchQueryParams(searchParams, offset*5, 50);

				const { data } = await api.get<IArticleCard[]>(
					`/v1/articles/search`,
					{
						params,
						paramsSerializer: (params) => params.toString(),
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
        const dateMap: Record<DateSearchPeriod, string | null> = {
                [DateSearchPeriod.day]: "t",
                [DateSearchPeriod.month]: "m",
                [DateSearchPeriod.year]: "y",
                [DateSearchPeriod.none]: null,
        };

        const sourceMap: Record<SourceType, string | null> = {
                [SourceType.Habr]: "habr",
                [SourceType.Devto]: "devto",
                [SourceType.Medium]: "medium",
                [SourceType.All]: null,
        };

        const cleanedTags = (params.tags || [])
                .map(tag => tag.trim())
                .filter(Boolean);

        return {
                search_text: params.search_text?.trim() || undefined,
                tags: cleanedTags.length ? cleanedTags : undefined,
                date: params.date !== undefined ? dateMap[params.date] ?? undefined : undefined,
                source: params.sourceType !== undefined ? sourceMap[params.sourceType] ?? undefined : undefined,
        }
}

function buildSearchQueryParams(params: SearchParams | null, offset: number, limit: number) {
	const search = new URLSearchParams();
	const cleaned = params ? convertURLParamsToRecord(params) : {} as Record<string, any>;


	if (cleaned.search_text) {
		search.set("search_text", cleaned.search_text);
	}

	if (cleaned.date) {
		search.set("date", cleaned.date);
	}

	if (cleaned.source) {
		search.set("source", cleaned.source);
	}

	cleaned.tags?.forEach(tag => search.append("tags", tag));

	search.set("offset", String(offset));
	search.set("limit", String(limit));


	return search;
}
