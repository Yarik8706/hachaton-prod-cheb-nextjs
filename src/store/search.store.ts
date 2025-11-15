import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/api/api";
import { IArticle, ISearchResult } from '@/store/types'
import { siteConfig } from "@/config/site.config";

//siteConfig.showMockData

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

	setSearchParams: (params: SearchParams) => void;
	getArticleById: (id: string) => Promise<IArticle | null>;
	getSearchResults: () => Promise<null>;
	getSearchingHistory: () => Promise<null>;
}

export const useArticleSearch = create<SearchStore>()(
	devtools((set, get) => ({
		isLoading: false,
		error: null,

		searchParams: null,
		searchingHistory: [],

		setSearchParams: (params: SearchParams) => {
			const cleaned: Record<string, any> = { ...params };

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
			
			set({ searchParams: cleaned as SearchParams });
			
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


		getSearchResults: async () => {
			const { searchParams } = get();
			if (!searchParams) {
				if (siteConfig.showMockData) {
					await new Promise(res => setTimeout(res, 500));

					const mock: ISearchResult = {
						articles: [
							{
								id: "mock-1",
								title: "For you article",
								tags: ["frontend", "react"],
								onDateCreated: new Date(),
								source: "https://habr.com/fgdsgfdg",
								summary: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit."
							},
							{
								id: "mock-2",
								title: "Mock Article 2",
								tags: ["backend", "nestjs"],
								onDateCreated: new Date(),
								source: "https://habr.com/fgdsgfdg",
								summary: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit."
							}
						],
						summarize: "Моковые данные. Результаты поиска."
					};

					set({ searchResults: mock });
					console.log(mock)
					return
				}

				const { data } = await api.get<ISearchResult>(
					`/api/v1/articles/me`
				)
				
				set({ searchResults: data })
				
				return 
			}

			try {
				set({ isLoading: true, error: null });
				console.log("fdsfsfdfsds")
				// ---- MOCK ----
				if (siteConfig.showMockData) {
					await new Promise(res => setTimeout(res, 500));

					const mock: ISearchResult = {
						articles: [
							{
								id: "mock-1",
								title: "Mock Article 1",
								tags: ["frontend", "react"],
								onDateCreated: new Date(),
								source: "https://habr.com/fgdsgfdg",
								summary: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit."
							},
							{
								id: "mock-2",
								title: "Mock Article 2",
								tags: ["backend", "nestjs"],
								onDateCreated: new Date(),
								source: "https://habr.com/fgdsgfdg",
								summary: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit."
							}
						],
						summarize: "Моковые данные. Результаты поиска."
					};

					set({ searchResults: mock });
					console.log(mock)
					return
				}

				let tags = ""
				searchParams.tags.forEach(tag => {
					tags += `&tags=${tag}`
				})

				const { data } = await api.get<ISearchResult>(
					`/api/v1/search?text=${searchParams.text}` +
					tags +
					`&tags=${searchParams.tags.join(",")}` +
					`&onDateCreated=${searchParams.dateSearchPeriod}` +
					`&sourceType=${searchParams.sourceType}`
				);

				set({ searchResults: data });
			} catch (e) {
				set({ error: "Ошибка при получении результатов поиска" });
				return null;
			} finally {
				set({ isLoading: false });
			}
		},


		getSearchingHistory: async () => {
			try {
				set({ isLoading: true, error: null });

				if (siteConfig.showMockData) {
					await new Promise(res => setTimeout(res, 500));

					const mockHistory = ["react", "zustand", "api", "frontend"];
					set({ searchingHistory: mockHistory });
					return mockHistory;
				}

				const { data } = await api.get<string[]>(`/api/v1/search/history`);
				set({ searchingHistory: data });
			} catch (e) {
				set({ error: "Ошибка при загрузке истории поиска" });
			} finally {
				set({ isLoading: false });
			}
		},
		getArticleById: async (id: string) => {
			try {
				set({ isLoading: true, error: null });

				// ---- MOCK ----
				if (siteConfig.showMockData) {
					await new Promise(res => setTimeout(res, 500));

					const mock: IArticle = {
						id: "mock-1",
						title: "Mock Article 1",
						tags: ["frontend", "react"],
						onDateCreated: new Date(),
						source: "https://habr.com/fgdsgfdg",
						text: "Mock Article 1"
					};

					return mock;
				}
				// ---------------

				const { data } = await api.get<IArticle>(`/api/v1/articles/${id}`);
				return data;
			} catch (e) {
				set({ error: "Ошибка при получении статьи" });
				return null;
			} finally {
				set({ isLoading: false });
			}
		},

	}))
);
