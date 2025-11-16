"use client";

import { useParams } from "next/navigation";
import { useArticleSearch } from "@/store/search.store";
import { useAi } from "@/store/ai.store";

import { useEffect, useState } from "react";
import { IArticle } from "@/store/types";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import MarkdownIt from "markdown-it";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

import { renderMarkdown } from "@/utils/markdown"; // <-- Markdown → HTML

export default function ArticlePage() {
	const { id } = useParams();
	const { getArticleById, isLoading } = useArticleSearch();
	const md = new MarkdownIt();

	const {
		getArticleSummary,
		summary,
		isLoading: isSummaryLoading,
	} = useAi();

	const [article, setArticle] = useState<IArticle | null>(null);
	const [notFound, setNotFound] = useState(false);

	const [accordionValue, setAccordionValue] = useState<string>("");

	// Загрузка статьи
	useEffect(() => {
		getArticleById(id as string).then(async (a) => {
			if (!a) {
				setNotFound(true);
				return;
			}

			setArticle(a);
			getArticleSummary(a.id).catch((e) => console.log(e));
		});
	}, []);

	// Авто-раскрытие аккордиона после загрузки summary
	useEffect(() => {
		if (!isSummaryLoading && summary) setAccordionValue("summary");
	}, [isSummaryLoading, summary]);

	// Скелетон
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
			</div>
		);
	}

	if (notFound) {
		return (
			<div className="w-full max-w-3xl mx-auto pt-10 px-4">
				<div className="text-sm text-gray-500 mb-6">
					<Link href="/home" className="hover:underline text-blue-600">
						Home
					</Link>{" "}
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
			{/* Навигация */}
			<div className="text-sm text-gray-500 mb-6">
				<Link href="/home" className="hover:underline text-blue-600">
					Home
				</Link>{" > "}
				<span className="text-gray-700">Article</span>
			</div>

			{/* Заголовок */}
			<h1 className="text-3xl font-semibold mb-5 leading-snug">
				{article.title}  
			</h1>

			{/* Дата + источник */}
			<div className="text-gray-500 text-sm mb-8">
				{new Date(article.creation_date).toLocaleDateString("ru-RU")}
				{" • "}
				<a
					className="text-blue-600 break-all cursor-pointer"
					href={article.source}
				>
					{article.source}
				</a>
			</div>

			{/* Теги */}
			<div className="flex flex-wrap gap-2 my-4">
				{article.tags.map((tag) => (
					<span
						key={tag}
						className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-full"
					>
						{tag}
					</span>
				))}
			</div>

			{/* Summary от ИИ */}
			<Accordion
				type="single"
				collapsible
				value={accordionValue}
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
					<AccordionTrigger className="text-[17px] font-semibold py-4">
						Краткий пересказ от ИИ
					</AccordionTrigger>

					<AccordionContent className="pb-4 pt-1">
						{/* Скелетон */}
						{isSummaryLoading && (
							<div className="space-y-3 mt-2">
								<Skeleton className="h-4 w-[80%]" />
								<Skeleton className="h-4 w-[95%]" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-[70%]" />
							</div>
						)}

						{/* Markdown summary */}
						{!isSummaryLoading && summary && (
								<div
									className="prose prose-gray max-w-none text-[15px] leading-relaxed mt-2"
									dangerouslySetInnerHTML={{
										__html: md.render(summary),   // <-- простое отображение markdown
									}}
								/>
						)}
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			{/* Полный текст статьи (уже HTML) */}
			<div
				className="prose prose-gray max-w-none text-[16px] leading-relaxed"
				dangerouslySetInnerHTML={{
					__html: article.text,
				}}
			/>
		</div>
	);
}
