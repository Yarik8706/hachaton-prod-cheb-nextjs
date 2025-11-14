import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/api/api";
import { IArticle, ISearchResult } from '@/store/types'

enum SourceType {
	Habr,
	Devto,
	Medium
}

interface SearchParams {
	tags: string[],
	onDateCreated: Date,
	offDateCreated: Date,
	sourceType: SourceType
}

interface SearchStore {
	getSearchParams: () => SearchParams,
	setSearchParams: (params: SearchParams) => void,
	getSearchResults: () => Promise<ISearchResult>
}

export const useArticleSearch = create<SearchStore>()(
	devtools((set, get) => ({
		getSearchParams: () => {
			return {
				tags: [],
				onDateCreated: new Date(),
				offDateCreated: new Date(),
				sourceType: SourceType.Habr
			}
		},
		setSearchParams: (params: SearchParams) => {
			
		},
		getSearchResults: () => {
			const { getSearchParams } = get()
			const searchParams = getSearchParams()
			
			return api.get<ISearchResult>(`/api/v1/search?tags=${searchParams.tags.join(',')}&onDateCreated=${searchParams.onDateCreated.toISOString()}&offDateCreated=${searchParams.offDateCreated.toISOString()}&sourceType=${searchParams.sourceType}`)
		}
	}))
);
