import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/api/api";
import {IProfile} from "@/store/types";


interface ProfileStore {
  profile: IProfile;
  address: string;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  setAddress: (address: string) => Promise<void>;
}

export const useProfile = create<ProfileStore>()(
  devtools((set) => ({
    profile: null,
    address: "",
    isLoading: false,
    error: null,
    fetchProfile: async () => {
      try {
        set({ isLoading: true, error: null });

        const { data } = await api.get<IProfile>("/api/v1/users/profile");
        set({ profile: data, address: data.address });
      } catch (err: unknown) {
        const errorMessage = "Неизвестная ошибка загрузки категорий";

        set({ error: errorMessage });
      } finally {
        set({ isLoading: false });
      }
    },
    setAddress: async (address: string) => {
      try {
        set({ isLoading: true, error: null });

        const params = new URLSearchParams({
          address: address,
        });
        
        

        const { data } = await api.post<string>(`/api/v1/users/address?${params.toString()}`);
        set({ isLoading: false, address: address });
      } catch (err: unknown) {
        const errorMessage = "Неизвестная ошибка загрузки категорий";

        set({ error: errorMessage });
      } finally {
        set({ isLoading: false });
      }
    }
  }))
);
