"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";

export default function HomePage() {
  useGSAP(() => {});

  return (
    <div className="w-full flex flex-col px-4 pt-6 pb-20 min-h-screen bg-white">

      {/* SEARCH BAR */}
      <div className="flex items-center gap-3 w-full">
        <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 flex-1">
          <Search className="size-5 text-gray-500" />
          <input
            type="text"
            placeholder="Введите строку поиска"
            className="ml-3 bg-transparent outline-none text-[15px] w-full"
          />
        </div>

        {/* Ваш фильтр (оставлен как есть) */}
        <button className="bg-yellow-400 hover:bg-yellow-500 transition rounded-xl p-3 flex items-center justify-center">
          <Search className="text-black size-5" />
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 mt-5">
        {/* Категории */}
        <button className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-xl w-[50%] text-[15px] text-gray-700">
          Все категории
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>

        {/* Период */}
        <button className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-xl w-[50%] text-[15px] text-gray-700">
          За всё время
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
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

        {/* Ещё карточки можно рендерить так же */}
      </div>
    </div>
  );
}
