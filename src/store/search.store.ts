import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/api/api";
import { IArticle, ISearchResult } from '@/store/types'

enum SourceType {
	Habr,
	Devto,
	Medium
}

enum DateSearchPeriod {
	none,
	day,
	month,
	year,
}

interface SearchParams {
	text: string,
	tags: string[],
	dateSearchPeriod: DateSearchPeriod,
	sourceType: SourceType
}

interface SearchStore {
	searchParams: SearchParams,
	setSearchParams: (params: SearchParams) => void,
	getSearchResults: () => Promise<ISearchResult>,
}

export const useArticleSearch = create<SearchStore>()(
	devtools((set, get) => ({
		searchParams: null,
		setSearchParams: (params: SearchParams) => {
			set({searchParams: params})

			const url = new URL(window.location.href);
			const p = url.searchParams;

			p.set("tags", params.tags.join(","));
			p.set("dateSearchPeriod", params.dateSearchPeriod.toString());
			p.set("sourceType", params.sourceType.toString());

			url.search = p.toString();

			window.history.replaceState({}, "", url.toString());
		},
		getSearchResults: () => {
			const { searchParams } = get()
			
			return api.get<ISearchResult>(`/api/v1/search?text=${searchParams.text}&tags=${searchParams.tags.join(',')}&onDateCreated=${searchParams.dateSearchPeriod.toString()}&sourceType=${searchParams.sourceType}`)
		}
	}))
);
