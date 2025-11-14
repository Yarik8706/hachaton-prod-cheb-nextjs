"use client";

import {createContext, useContext, useEffect, useState} from "react";
import { api } from "@/api/api";
import {useProfile} from "@/store/profile.store";
import { useArticleSearch } from '@/store/search.store'
import { useAuth } from '@/providers/AuthProvider'

const AppContext = createContext({
	
})

export default function LoadDataProvider({ children }: { children: React.ReactNode }) {
	const {isAuth} = useAuth()
	const {fetchProfile} = useProfile()
	const {getSearchingHistory} = useArticleSearch()

	useEffect(() => {
		if (isAuth) {
			getSearchingHistory()
			fetchProfile()
			
		}
	}, [isAuth])
	
	
	return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
}
