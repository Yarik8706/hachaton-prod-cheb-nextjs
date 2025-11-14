"use client";

import { useState } from 'react'
import { Filter, Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function HomePage() {
  const [isSearching, setIsSearching] = useState(false)

  return (
    <div>
      <div className="flex flex-col px-5 pt-10 pb-24 min-h-screen transition-all duration-300">
        <h1
          className={`text-2xl font-bold text-center mb-6 font-haas transition-all duration-300 ease-out ${
            isSearching
              ? 'opacity-0 -translate-y-4 pointer-events-none select-none h-0 mb-0'
              : 'opacity-100 translate-y-0'
          }`}
        >
          Название
        </h1>

        <div
          className={`w-full transition-all duration-300 ${
            isSearching
              ? '-mx-5 px-5 py-4 sticky top-0 z-20 bg-white/90 backdrop-blur shadow-xl rounded-b-3xl'
              : 'max-w-sm'
          }`}
        >
          <div className="grid w-full items-center gap-3">
            <Label
              htmlFor="search"
              className={`flex items-center gap-2 text-muted-foreground transition-all duration-200 ${
                isSearching ? 'opacity-0 -translate-y-2 h-0 overflow-hidden' : 'opacity-100'
              }`}
            >
              <Search className="h-4 w-4" /> Search
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="search"
                className={`flex-1 transition-all duration-300 ${
                  isSearching
                    ? 'bg-white shadow-md border-transparent focus-visible:ring-0 focus-visible:ring-offset-0'
                    : ''
                }`}
                onFocus={() => setIsSearching(true)}
                onBlur={() => setIsSearching(false)}
              />
              <button
                type="button"
                className={`flex items-center justify-center rounded-2xl bg-black text-white transition-all duration-300 ${
                  isSearching
                    ? 'opacity-100 translate-x-0 w-12 h-12'
                    : 'opacity-0 -translate-x-4 pointer-events-none w-0 h-0'
                }`}
                aria-label="Фильтр"
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-10 mb-4">Для вас</h2>

        <div className="flex flex-col gap-4">
          <div className="bg-gray-200 rounded-xl p-4">
            <div className="font-medium">Название</div>
            <div className="text-sm text-gray-600">Подзаголовок</div>
          </div>

          <div className="bg-gray-200 rounded-xl p-4">
            <div className="font-medium">Название</div>
            <div className="text-sm text-gray-600">Подзаголовок</div>
          </div>

          <div className="bg-gray-200 rounded-xl p-4">
            <div className="font-medium">Название</div>
            <div className="text-sm text-gray-600">Подзаголовок</div>
          </div>
        </div>
      </div>
    </div>
  )
}
