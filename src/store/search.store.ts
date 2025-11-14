import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/api/api";
import { ISearchResult } from "@/store/types";

export enum SourceType {
	Habr,
	Devto,
	Medium
}

export enum DateSearchPeriod {
	none,
	day,
	month,
	year,
}

interface SearchParams {
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

	setSearchParams: (params: SearchParams) => void;
	getSearchResults: () => Promise<ISearchResult | null>;
	getSearchingHistory: () => Promise<string[] | null>;
}

export const useArticleSearch = create<SearchStore>()(
	devtools((set, get) => ({
		isLoading: false,
		error: null,

		searchParams: null,
		searchingHistory: [],

		setSearchParams: (params: SearchParams) => {
			set({ searchParams: params });

			const url = new URL(window.location.href);
			const p = url.searchParams;

			p.set("text", params.text);
			p.set("tags", params.tags.join(","));
			p.set("dateSearchPeriod", params.dateSearchPeriod.toString());
			p.set("sourceType", params.sourceType.toString());

			url.search = p.toString();
			window.history.replaceState({}, "", url.toString());
		},

		getSearchResults: async () => {
			const { searchParams } = get();
			if (!searchParams) return null;

			try {
				set({ isLoading: true, error: null });

				const { data } = await api.get<ISearchResult>(
					`/api/v1/search?text=${searchParams.text}` +
					`&tags=${searchParams.tags.join(",")}` +
					`&onDateCreated=${searchParams.dateSearchPeriod}` +
					`&sourceType=${searchParams.sourceType}`
				);

				return data;
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

				const { data } = await api.get<string[]>(`/api/v1/search/history`);
				set({ searchingHistory: data });

				return data;
			} catch (e) {
				set({ error: "Ошибка при загрузке истории поиска" });
				return null;
			} finally {
				set({ isLoading: false });
			}
		}
	}))
);
