import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface YandexStore {
	loginUrl: string;
	fetchLoginUrl: () => Promise<void>;
}

export const useYandexLogin = create<YandexStore>()(
	devtools((set) => ({
		loginUrl: "",
		fetchLoginUrl: async () => {
			
		},
	}))
);
