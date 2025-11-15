import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/api/api";
import { siteConfig } from "@/config/site.config";

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

interface AiStore {
	error: string;
	isLoading: boolean;
	summary: string;
	getArticleSummary: (id: string) => Promise<string>;
}

export const useAi = create<AiStore>()(
	devtools((set, get) => ({
		isLoading: false,
		summary: "",
		getArticleSummary: async (id: string) => {
			try {
				set({ isLoading: true });
				if (siteConfig.showMockData) {
					await delay(500);
					set({ summary: "Mock summary" });
					return;
				}
				const { data } = await api.get<string>(`/v1/articles/${id}/summarize`);
				set({ summary: data });
			} catch {
				set({ error: "Ошибка при получении суммирования статьи" });
			} finally {
				set({ isLoading: false });
			}
		}
	}))
);
