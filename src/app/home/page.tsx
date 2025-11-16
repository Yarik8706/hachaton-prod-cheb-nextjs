"use client";

import { Search, X } from 'lucide-react'
import { useEffect, useState, useRef, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  SearchParams,
  useArticleSearch,
  DateSearchPeriod,
  SourceType,
} from '@/store/search.store'
import { formatDate } from '@/components/utils/format-date'
import { ArticleFilterSheet } from '@/components/sheets/ArticleFilterSheet'
import { Skeleton } from '@/components/ui/skeleton';
import CommonSpinner from '@/components/common/CommonSpinner'
import { useRouter } from 'next/navigation'
import { useGSAP } from '@gsap/react'
import { gsap} from "@/utils/gsap"
import { loadHistory, saveQuery } from '@/utils/utils'
import { clearTimeout } from 'node:timers'

export default function HomePage() {
  
  const router = useRouter()
  const [searching, setSearching] = useState(false)
  const [searchText, setSearchText] = useState("")
  const params = useSearchParams()
  const searchParamsString = params.toString()
  const [showHistory, setShowHistory] = useState(false)
  const [loadNextArticles, setLoadNextArticles] = useState(false)
  const queryEntries = useMemo(() => {
    const query = new URLSearchParams(searchParamsString)
    return Array.from(query.entries())
  }, [searchParamsString])
  
  const isAnimStarted = useRef(false)

  const isParamsEmpty = useMemo(() => {
    if (queryEntries.length === 0) return true

    return queryEntries.every(([, value]) => value.trim() === '')
  }, [queryEntries])

  const {
    searchResults,
    setSearchParams,
    isLoading,
    searchingHistory,
    getSearchingHistory,
    setSearchingHistory,
    getSearchResults,
    loadMore               
  } = useArticleSearch()

  const searchRef = useRef<HTMLDivElement | null>(null)

  const hasActiveFilters = useMemo(() => {
    return queryEntries.some(([key, value]) =>
      key !== 'text' && value.trim() !== ''
    )
  }, [queryEntries])

  // первая загрузка
  useEffect(() => {
    getSearchingHistory()
    getSearchResults()
  }, [])

  // Выполнить один раз при первой загрузке
  useEffect(() => {
    if (isParamsEmpty) return;

    const initialParams: any = {};

    queryEntries.forEach(([key, value]) => {
      if (value.trim() !== "") {
        initialParams[key] = value;
      }
    });

    // Если в URL есть search_text → синхронизируем инпут
    if (initialParams.search_text && initialParams.search_text !== searchText) {
      setSearchText(initialParams.search_text);
    }

    setSearchParams(initialParams as SearchParams);
  }, []); 

  // при изменении query
  useEffect(() => {
    getSearchResults()
    setLoadNextArticles(false)
    const textParams = params.get("search_text") || ""
    if (searchText != textParams) setSearchText(textParams)
  }, [params])
  
  useGSAP(() => {
    if (searchResults == undefined ||
      searchResults?.articles.length <= 0 || searchResults?.articles.length > 10) return
    if(isAnimStarted.current) return
    isAnimStarted.current = true
    gsap.fromTo(".article-card > *", {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.5
    }, {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.5,
      onComplete: () => {
        isAnimStarted.current = false
      }
    })
    
  }, [searchResults])

  // клик вне поиска
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!searchRef.current) return
      if (!searchRef.current.contains(e.target as Node)) {
        setShowHistory(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])
  
  useEffect(() => {
    const onScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const fullHeight = document.body.offsetHeight;

      if (fullHeight - scrollPosition < 250 && !isLoading && searchResults != undefined
        && searchResults?.articles.length >= 10) {
        setLoadNextArticles(true)
        loadMore();
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLoading]);

  useEffect(() => {
    updateHistory()
  }, []);
  
  const updateHistory = () => {
    const history = loadHistory();
    setSearchingHistory(history);
  }

  const onSearch = (text: string) => {
    setSearchText(text)
    setSearching(text !== '')
    setShowHistory(text !== '')
    saveQuery(text)
    updateHistory()
  }

  const handleFiltersSubmit = () => {
    setLoadNextArticles(false)
    getSearchResults()
  }

  const handleClearFilters = () => {
    setSearchParams({
      search_text: "",
      tags: [],
      date: DateSearchPeriod.none,
      sourceType: SourceType.All,
    } as SearchParams)
    handleFiltersSubmit()
  }

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (searchText.trim() === "") {
      setSearchParams({ search_text: "" } as SearchParams);
      return;
    }
    
    timeoutRef.current = setTimeout(() => {
      setSearchParams({ search_text: searchText } as SearchParams);
      getSearchResults();
      setSearching(false);
    }, 500);

  }, [searchText]);


  const onHistoryClick = (value: string) => {
    setSearchText(value)
    setSearchParams({ search_text: value } as SearchParams)
    setShowHistory(false)
    setSearching(true)
  }

  const filteredHistory = searchingHistory?.filter(v =>
    v.toLowerCase().includes(searchText.toLowerCase())
    && v.toLowerCase() != searchText.toLowerCase()
  )

  const showSkeleton = (searching || isLoading) && !loadNextArticles
  // console.log("show skeleton: " + showSkeleton)
  // console.log("searching: " + searching)
  // console.log("isLoading: " + isLoading)
  // console.log("loadNextArticles: " + loadNextArticles)

  return (
    <div className="w-full flex flex-col px-4 pt-6 pb-20 space-y-1 min-h-screen">

      {isParamsEmpty && <div className="text-2xl font-semibold mb-6">Новости</div>}

      <div className="flex items-center gap-3 w-full">

        <div ref={searchRef} className="relative flex items-center bg-[#e9ecf0] rounded-xl px-4 py-3 flex-1">

          <Search className="size-5 text-gray-500" />

          <input
            type="text"
            value={searchText}
            onChange={(v) => onSearch(v.target.value)}
            placeholder="Введите строку поиска"
            className="ml-3 bg-transparent outline-none text-[15px] w-full"
          />

          {showHistory && filteredHistory?.length !== 0 && (
            <div className="w-full absolute left-0 top-[100%] z-40">
              <div className="w-full bg-white rounded-xl flex flex-col py-1 mt-1 shadow-2xl overflow-hidden">

                {filteredHistory?.length === 0 && (
                  <div className="px-3 py-2 text-gray-400">Ничего не найдено</div>
                )}

                {filteredHistory?.map((value) => (
                  <button
                    key={value}
                    onClick={() => onHistoryClick(value)}
                    className="hover:bg-gray-300 px-3 text-gray-700 py-2 w-full text-left"
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        <div className="flex items-center gap-2">
          <ArticleFilterSheet
            key={searchParamsString}
            currentText={searchText}
            onSubmit={handleFiltersSubmit}
          />
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="cursor-pointer bg-white hover:bg-gray-300 transition rounded-xl p-3 flex items-center justify-center"
            >
              <X className="text-black size-5"/>
            </button>
          )}
        </div>
      </div>

      {/* RESULTS */}
      <div className="flex flex-col gap-3 mt-6">
        {isParamsEmpty && <div className="font-semibold text-2xl">Для вас</div>}
        <div className="flex flex-col gap-6 article-container">
          {showSkeleton &&
            <>
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                  <div className="flex gap-2 pb-2">
                    <Skeleton className="h-6 w-[50px]" /> <Skeleton className="h-6 w-[50px]" />
                  </div>

                  <h2 className="font-semibold text-[17px] leading-snug">
                    <Skeleton className="h-6 w-[250px]" />
                  </h2>

                  <div className="text-[14px] text-gray-700 mt-3 leading-relaxed space-y-2">
                    <Skeleton className="h-4 max-w-[600px]" />
                    <Skeleton className="h-4 max-w-[600px]" />
                  </div>

                  <div className="text-gray-500 text-xs mt-4">
                    <Skeleton className="h-4 w-[250px]" />
                  </div>
                </div>
              ))}
            </>
          }

          {searchResults?.articles.map((item, idx) => {
            return (
              <div key={idx}
                   onClick={() => router.push(`/home/article/${item.id}`)}
                   className="article-card cursor-pointer bg-white rounded-2xl shadow-sm hover:scale-[1.02] duration-600 hover:shadow-md transition-all
                   border border-gray-200 p-5">

                <div className="flex gap-2">
                  {item.tags.map((tag, idx) => {
                    return (
                      <div
                        key={idx}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full mb-3"
                      >
                        {tag}
                      </div>
                    )
                  })
                  }
                </div>

                <h2 className="font-semibold text-[17px] leading-snug">
                  {item.title}
                </h2>

                <a
                  href="#"
                  className="text-blue-500 text-sm mt-2 inline-block break-all overflow-hidden w-[300px] text-nowrap text-ellipsis"
                >
                  {item.source}
                </a>

                <p className="text-[14px] text-gray-700 mt-3 leading-relaxed">
                  {item.summary || item.title}
                </p>

                <div className="text-gray-500 text-xs mt-4">{formatDate(item.creation_date)}</div>
              </div>
            )
          })}

          {loadNextArticles && <CommonSpinner variant={"outline"} title={"Загрузка..."}/>}
        </div>
      </div>

    </div>
  );
}
