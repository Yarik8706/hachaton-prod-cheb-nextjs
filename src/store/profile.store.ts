import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { api } from "@/api/api";
import { IProfile } from "@/store/types";
import { siteConfig } from "@/config/site.config";

const mockProfile: IProfile = {
  id: "1",
  email: "yandex@yandex.ru",
  interests: ["frontend", "backend"]
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface ProfileStore {
  profile: IProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  setInterests: (interests: string[]) => Promise<void>;
  logout: () => null;
}

export const useProfile = create<ProfileStore>()(
  devtools((set, get) => ({
    profile: null,
    isLoading: false,
    error: null,

    fetchProfile: async () => {
      try {
        set({ isLoading: true, error: null });

        if (siteConfig.showMockData) {
          await delay(500);
          set({ profile: mockProfile });
          return;
        }

        const { data } = await api.get<IProfile>("/api/v1/users/profile");
        set({ profile: data });

      } catch (error) {
        set({ error: "Ошибка при загрузке профиля" });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    setInterests: async (interests: string[]) => {
      try {
        const { profile } = get();
        if (!profile) return;

        set({ isLoading: true, error: null });

        if (siteConfig.showMockData) {
          await delay(500);
          const updated = { ...profile, interests };
          set({ profile: updated });
          return;
        }

        await api.patch("/api/v1/users/interests", { interests });

        profile.interests = interests;
        set({ profile });

      } catch (error) {
        set({ error: "Ошибка при обновлении интересов" });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    logout: () => null
  }))
);
