import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/api/api";
import {IProfile} from "@/store/types";


interface ProfileStore {
	loginUrl: string;
	fetchLoginUrl: () => Promise<void>;
}

export const useYandexLogin = create<ProfileStore>()(
	devtools((set) => ({
		loginUrl: null,
		fetchLoginUrl: async () => {
			
		},
	}))
);
