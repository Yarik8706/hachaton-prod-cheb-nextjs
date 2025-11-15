"use client";

import { Filter, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ArticleFilterSheet } from '@/components/sheets/ArticleFilterSheet'
import { useSearchParams } from 'next/navigation'
import { useArticleSearch } from '@/store/search.store'
import { formatDate } from '@/components/utils/format-date'
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function HomePage() {
  const [searching, setSearching] = useState(false)
  const params = useSearchParams()
  const { searchingHistory, getSearchingHistory, getSearchResults } = useArticleSearch()

  const searchResults = [
    {
      id: "mock-1",
      title: "Mock Article 1",
      tags: ["frontend", "react"],
      onDateCreated: new Date(),
      source: "https://habr.com/fgdsgfdg",
      summary: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit."
    },
    {
      id: "mock-2",
      title: "Mock Article 2",
      tags: ["backend", "nestjs"],
      onDateCreated: new Date(),
      source: "https://habr.com/fgdsgfdg",
      summary: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit."
    }
  ]
  
  useEffect(() => {
    getSearchingHistory()
    getSearchResults()
  }, [])

  useEffect(() => {
    getSearchResults()
  }, [params])

  return (
    <div className="w-full flex flex-col px-4 pt-6 pb-20 space-y-1 min-h-screen">
      {!searching && <div className="text-2xl font-semibold mb-6">Новости</div>}
      <div className="flex items-center gap-3 w-full">
        <div className="flex items-center bg-[#e9ecf0] rounded-xl px-4 py-3 flex-1">
          <Search className="size-5 text-gray-500" />

          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none border-none">
              <input
                type="text"
                onChange={(v,
                ) => setSearching(v.target.value != '')}
                placeholder="Введите строку поиска"
                className="ml-3 bg-transparent outline-none text-[15px] w-full"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
        </div>

        {/*<ArticleFilterSheet onSubmit={() => {*/}
        {/*}} />*/}
      </div>
      
      
      
      <div className="rounded-xl bg-white px-2 py-2 space-y-2">
        <div className="flex justify-between items-center">
          <div>Недавние запросы</div>
          <div className="py-2 px-4 rounded-xl bg-[#e9ecf0] border border-gray-300">x</div>
        </div>
        <div className="space-y-2 w-full">
          <button className="py-2 px-3 rounded-xl bg-[#e9ecf0] border border-gray-300 w-full text-left">Запрос</button>
        </div>
      </div>

      {/* RESULTS item.source.replace("https://", "").split("/")[0] */}
      <div className="flex flex-col gap-6 mt-6">

        {searchResults?.map((item, idx) => {
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5"
            >
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
                {item.title}
              </p>

              <div className="text-gray-500 text-xs mt-4">{formatDate(item.onDateCreated)}</div>
            </div>
          )
        })
        }
      </div>

    </div>
  );
}
