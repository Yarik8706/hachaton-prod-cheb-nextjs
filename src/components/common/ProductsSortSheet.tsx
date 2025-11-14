"use client";

import { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {SearchParams} from "next/dist/server/request/search-params";
import {SortDesc} from "lucide-react";
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useSearchParams } from 'next/navigation'
import { useArticleSearch } from '@/store/search.store'

interface IProps {
  onSubmit: () => void
}

export function ProductsFilterSheet({ onSubmit } : IProps) {
  const { setSearchParams } = useArticleSearch();

  const [sort, setSort] = useState<SearchParams>({
    sort_by_price: "",
    sort_by_time: "",
  });

  const handleChange = (key: keyof SearchParams, value: any) =>
    setSort((prev) => ({ ...prev, [key]: value }));

  const handleApply = () => {
    // fetchProducts(sort);
    onSubmit()
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button><SortDesc></SortDesc></Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[90vw] sm:w-full">
        <SheetHeader>
          <SheetTitle>Сортировка</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="sort_by_price">Сортировка по цене</Label>
            <select
              id="sort_by_price"
              className="w-full border rounded-md p-2"
              value={sort.sort_by_price}
              onChange={(e) => handleChange("sort_by_price", e.target.value)}
            >
              <option value="">Не сортировать</option>
              <option value="asc">От большего к меньшему</option>
              <option value="desc">От меньше к большему</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort_by_time">Сортировка по времени доставки</Label>
            <select
              id="sort_by_time"
              className="w-full border rounded-md p-2"
              value={sort.sort_by_time}
              onChange={(e) =>
                handleChange("sort_by_time", e.target.value)
              }
            >
              <option value="">Не сортировать</option>
              <option value="asc">От большего к меньшему</option>
              <option value="desc">От меньше к большему</option>
            </select>
          </div>
        </div>

        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button onClick={handleApply} className="w-full">
              Применить
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}