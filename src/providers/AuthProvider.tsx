"use client";

import {createContext, useContext, useEffect, useState} from "react";
import { api } from "@/api/api";
import {useProfile} from "@/store/profile.store";

const AppContext = createContext({
  isAuth: false,
  setToken: (token: string) => {},
  clearToken: () => {},
  tokenUpdate: () => {},
})

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false); 
  const {fetchProfile, profile}= useProfile()
  
  const tokenUpdate = () => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      setIsAuth(true);
      fetchProfile();
    }
  }
  
  const setToken = (token: string) => {
    localStorage.setItem("accessToken", token);
    setIsAuth(true);
  }

  const clearToken = () => {
    localStorage.removeItem("accessToken");
    setIsAuth(false);
  }

  useEffect(() => {
    tokenUpdate()

    // if (localStorage.getItem("accessToken") == null) return;
    // const refresh = async () => {
    //   try {
    //     const res = await api.post("api/v1/auth/refresh");
    //     localStorage.setItem("accessToken", res.data.access)
    //   } catch {
    //     setIsAuth(false);
    //     clearToken();
    //   }
    // };
    // refresh().then(() => tokenUpdate());
  }, [tokenUpdate]);

  return <AppContext.Provider value={{isAuth, setToken, clearToken, tokenUpdate}}>{children}</AppContext.Provider>;
}


export const useAuth = () => {
  return useContext(AppContext);
}
