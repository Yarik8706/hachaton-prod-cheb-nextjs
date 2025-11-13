"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {useAuth} from "@/providers/AuthProvider";

export default function LogoutButton() {
  const router = useRouter();
  const {clearToken} = useAuth()

  const handleLogout = () => {
    clearToken();
    router.replace("/login");
  };

  return (
    <Button
      className="rounded-full border border-pond-water-dark/40 bg-white px-5 py-2 text-sm font-medium text-pond-water-dark shadow-sm transition hover:bg-pond-water/20 dark:bg-gray-800 dark:text-pond-water"
      onClick={handleLogout}
    >
      Выйти
    </Button>
  );
}
