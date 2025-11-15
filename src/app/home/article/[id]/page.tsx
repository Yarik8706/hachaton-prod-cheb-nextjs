"use client";

import { useParams } from "next/navigation";
import { useArticleSearch } from "@/store/search.store";
import { useEffect, useState } from "react";
import { IArticle } from "@/store/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useAi } from "@/store/ai.store";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export default function ArticlePage() {
	const { id } = useParams();
	const { getArticleById, isLoading } = useArticleSearch();

	const {
		getArticleSummary,
		summary,
		isLoading: isSummaryLoading,
	} = useAi();

	const [article, setArticle] = useState<IArticle | null>(null);
	const [notFound, setNotFound] = useState(false);

	// Управление аккордионом вручную
	const [accordionValue, setAccordionValue] = useState<string>("");

	useEffect(() => {
		getArticleById(id as string).then((a) => {
			if (!a) {
				setNotFound(true);
			} else {
				setArticle(a);
				getArticleSummary(a.text); // ← Запускаем генерацию summary
			}
		});
	}, []);

	// Авто-открытие аккордиона после загрузки summary
	useEffect(() => {
		if (!isSummaryLoading && summary) {
			setAccordionValue("summary");
		}
	}, [isSummaryLoading, summary]);

	// ===== Скелетон статьи =====
	if (isLoading && !article && !notFound) {
		return (
			<div className="w-full max-w-3xl mx-auto pt-10 px-4 space-y-6">
				<Skeleton className="h-5 w-[140px]" />
				<Skeleton className="h-8 w-[70%]" />
				<Skeleton className="h-5 w-[40%]" />
				<Skeleton className="h-20 w-full" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-[90%]" />
				<Skeleton className="h-4 w-[95%]" />
				<Skeleton className="h-4 w-full" />
			</div>
		);
	}

	// ===== Статья не найдена =====
	if (notFound) {
		return (
			<div className="w-full max-w-3xl mx-auto pt-10 px-4">
				<div className="text-sm text-gray-500 mb-6">
					<Link href="/home" className="hover:underline text-blue-600">
						Home
					</Link>
					{" > "}
					<span className="text-gray-700">Article</span>
				</div>

				<div className="text-center text-xl text-gray-600">
					Статья не найдена
				</div>
			</div>
		);
	}

	if (!article) return null;

	return (
		<div className="w-full max-w-3xl mx-auto pt-10 px-4">

			{/* ===== Навигация ===== */}
			<div className="text-sm text-gray-500 mb-6">
				<Link href="/home" className="hover:underline text-blue-600">
					Home
				</Link>
				{" > "}
				<span className="text-gray-700">Article</span>
			</div>

			{/* ===== Заголовок ===== */}
			<h1 className="text-3xl font-semibold mb-5 leading-snug">
				{article.title}
			</h1>

			{/* ===== Дата и источник ===== */}
			<div className="text-gray-500 text-sm mb-8">
				{new Date(article.creation_date).toLocaleDateString("ru-RU")}
				{" • "}
				<span className="text-blue-600 break-all">{article.source}</span>
			</div>

			{/* ===== Пересказ от ИИ (Аккордион) ===== */}
			<Accordion
				type="single"
				collapsible
				value={accordionValue}
				defaultValue={""}
				onValueChange={setAccordionValue}
				className="mb-8"
			>
				<AccordionItem
					value="summary"
					className="
            rounded-xl 
            border border-blue-200 
            bg-blue-50/70 
            shadow-sm 
            px-4
          "
				>
					<AccordionTrigger
						className="
              text-[17px] 
              font-semibold
              py-4
            "
					>
						Краткий пересказ от ИИ
					</AccordionTrigger>

					<AccordionContent className="pb-4 pt-1">

						{/* Скелетон summary */}
						{isSummaryLoading && (
							<div className="space-y-3 mt-2">
								<Skeleton className="h-4 w-[80%]" />
								<Skeleton className="h-4 w-[95%]" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-[70%]" />
							</div>
						)}

						{/* Готовый summary */}
						{!isSummaryLoading && summary && (
							<div
								className="
                  text-gray-800 
                  text-[15px] 
                  leading-relaxed 
                  mt-2 
                  whitespace-pre-line
                "
							>
								{summary}
							</div>
						)}
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			{/* ===== Основной текст ===== */}
			<div className="prose prose-gray max-w-none text-[16px] leading-relaxed">
				{article.text.split("\n").map((p, idx) => (
					<p key={idx} className="mb-4">
						{p}
					</p>
				))}
			</div>

			{/* ===== Теги ===== */}
			<div className="flex flex-wrap gap-2 mt-8">
				{article.tags.map((tag) => (
					<span
						key={tag}
						className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
					>
            {tag}
          </span>
				))}
			</div>
		</div>
	);
}
