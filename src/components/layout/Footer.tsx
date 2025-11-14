"use client"

import Link from "next/link";
import Container from "@/components/common/container";
import { siteConfig } from '@/config/site.config'
import ProductIcon from '@/components/common/ProductIcon'

export const Footer = () => {
  return (
    <div className="bg-[#292929] w-full">
      <Container>
        <footer className="bg-[#292929] px-6 py-4 text-sm
    text-gray-500 shadow-sm">
          <ProductIcon className={""}/>
          <div className="flex flex-col w-full h-full items-center justify-between gap-2 sm:flex-row border-t border-gray-600 mt-4 pt-4">
            <span>© {new Date().getFullYear()} {siteConfig.title}. Все права защищены.</span>
          </div>
        </footer>
      </Container>
    </div>
  );
};
