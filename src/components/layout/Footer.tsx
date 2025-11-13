"use client"

import Link from "next/link";
import Container from "@/components/common/container";

export const Footer = () => {
  return (
    <Container className="bg-[var(--second-background-color)] w-full">
      <footer className="bg-[var(--second-background-color)] px-6 py-4 text-sm
   
    text-gray-500 shadow-sm backdrop-blur dark:bg-gray-800/60 dark:text-gray-300">
      <div className="flex flex-col w-full h-full items-center justify-between gap-2 sm:flex-row border-t">
        <span>© {new Date().getFullYear()} T-Доставка. Все права защищены.</span>
      </div>
    </footer></Container>
  );
};
