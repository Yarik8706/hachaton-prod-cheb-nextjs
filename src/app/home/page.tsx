"use client";

import { Filter, Search } from 'lucide-react'
import { useState } from 'react'
import { ArticleFilterSheet } from '@/components/sheets/ArticleFilterSheet'

export default function HomePage() {
  const [searching, setSearching] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  
  
  return (
    <div className="w-full flex flex-col px-4 pt-6 pb-20 min-h-screen">
      {!searching && <div className="text-2xl font-semibold mb-6">Новости</div>}
      <div className="flex items-center gap-3 w-full">
        <div className="flex items-center bg-[#e9ecf0] rounded-xl px-4 py-3 flex-1">
          <Search className="size-5 text-gray-500" />
          <input
            type="text"
            onChange={(v
            ) => setSearching(v.target.value != "")}
            placeholder="Введите строку поиска"
            className="ml-3 bg-transparent outline-none text-[15px] w-full"
          />
        </div>

        <ArticleFilterSheet onSubmit={() => setShowFilter(false)}/>
      </div>

      {/* RESULTS */}
      <div className="flex flex-col gap-6 mt-6">

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full mb-3">
            Инвестиции
          </div>

          <h2 className="font-semibold text-[17px] leading-snug">
            Т-Инвестиции запустили удалённое
            открытие брокерского счёта для иностранцев
            с картой Black
          </h2>

          <a
            href="#"
            className="text-blue-500 text-sm mt-2 inline-block break-all"
          >
            www.tbank.ru/about/news/14112025...
          </a>

          <p className="text-[14px] text-gray-700 mt-3 leading-relaxed">
            Москва, Россия — 14 ноября 2025 г. Т-Инвестиции
            упростили доступ к российскому фондовому рынку
            для клиентов-иностранных граждан. Теперь
            нерезиденты-владельцы карты Black смогут открыть
            брокерский счёт…
          </p>

          <div className="text-gray-500 text-xs mt-4">14 нояб. 2025</div>
        </div>

      </div>
      
    </div>
  );
}
