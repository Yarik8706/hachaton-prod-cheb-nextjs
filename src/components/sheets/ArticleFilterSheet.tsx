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

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Filter, SortDesc } from 'lucide-react'
import { useArticleSearch } from "@/store/search.store";

import { SourceType, DateSearchPeriod } from "@/store/search.store";
import TagHandler from '@/components/common/TagHandler'

interface IProps {
  onSubmit: () => void;
}

export function ArticleFilterSheet({ onSubmit }: IProps) {
  const { setSearchParams } = useArticleSearch();

  const [tags, setTags] = useState<string[]>([]);
  const [tagValue, setTagValue] = useState("");

  const [dateSearchPeriod, setDateSearchPeriod] 
    = useState<DateSearchPeriod>(
    DateSearchPeriod.none,
  );

  const [sourceType, setSourceType] = 
    useState<SourceType>(SourceType.All);

  const addTag = () => {
    const t = tagValue.trim();
    if (!t) return;
    setTags((prev) => [...prev, t]);
    setTagValue("");
  };

  const removeTag = (i: number) =>
    setTags((prev) => prev.filter((_, idx) => idx !== i));

  const handleApply = () => {
    setSearchParams({
      text: "",
      tags,
      dateSearchPeriod,
      sourceType,
    });

    onSubmit();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <a
          className="cursor-pointer bg-[var(--main-color)] hover:bg-yellow-500 transition rounded-xl p-3 flex items-center justify-center">
          <Filter className="text-black size-5"/>
        </a>
      </SheetTrigger>

      <SheetContent side="right" className="w-[90vw] sm:w-[380px]">
        <SheetHeader>
          <SheetTitle>Фильтры</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-4">

          {/* SOURCE TYPE */}
          <div className="space-y-2">
            <Label>Источник</Label>
            <select
              className="w-full border rounded-md p-2"
              value={sourceType}
              onChange={(e) => setSourceType(Number(e.target.value))}
            >
              <option value={SourceType.All}>Все источники</option>
              <option value={SourceType.Habr}>Habr</option>
              <option value={SourceType.Devto}>Dev.to</option>
              <option value={SourceType.Medium}>Medium</option>
            </select>
          </div>

          {/* DATE PERIOD */}
          <div className="space-y-2">
            <Label>Период</Label>
            <select
              className="w-full border rounded-md p-2"
              value={dateSearchPeriod}
              onChange={(e) => setDateSearchPeriod(Number(e.target.value))}
            >
              <option value={DateSearchPeriod.none}>За всё время</option>
              <option value={DateSearchPeriod.day}>За день</option>
              <option value={DateSearchPeriod.month}>За месяц</option>
              <option value={DateSearchPeriod.year}>За год</option>
            </select>
          </div>

          {/* TAGS */}
          <div className="space-y-2">
            <Label>Теги</Label>

            <div className="flex gap-2">
              <Input
                value={tagValue}
                onChange={(e) => setTagValue(e.target.value)}
                placeholder="Добавить тег"
              />
              <Button className="py-2 px-4" onClick={addTag}>+</Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((t, i) => (
                <TagHandler key={i} title={t} onDelete={() => removeTag(i)}/>
              ))}
            </div>
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
