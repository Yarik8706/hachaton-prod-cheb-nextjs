"use client";

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGSAP } from '@gsap/react'

export default function HomePage() {
  
  
  
  useGSAP(() => {
    
  })

  const startSearch = () => {

  }

  return (
    <div>
      <div className="flex flex-col px-5 pt-10 pb-24 min-h-screen">

        <h1 className="text-2xl font-bold text-center mb-6 font-haas">Название</h1>

        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="picture"><Search /> Se</Label>
          <Input id="picture" />
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
