import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/api/api";
import { IProfile } from "@/store/types";

interface ProfileStore {
  profile: IProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  setInterests: (interests: string[]) => Promise<void>;
  
}

export const useProfile = create<ProfileStore>()(
  devtools((set, get) => ({
    profile: null,
    isLoading: false,
    error: null,

    fetchProfile: async () => {
      try {
        set({ isLoading: true, error: null });
        const { data } = await api.get<IProfile>("/api/v1/users/profile");
        set({ profile: data, });
      } catch (error) {
        const errorMessage = "Ошибка при загрузке профиля";
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    setInterests: async (interests: string[]) => {
      try {
        const {profile} = get();
        
        if (!profile) {
          return
        }
        set({ isLoading: true, error: null });
        await api.patch("/api/v1/users/interests", { interests });
        
        profile.interests = interests;
        set({ profile });
      } catch (error) {
        const errorMessage = "Ошибка при обновлении интересов";
        set({ error: errorMessage });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },
  }))
);