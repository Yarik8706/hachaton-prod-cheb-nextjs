import { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "usehooks-ts";
import { layoutConfig } from "@/config/layout.config";
import { gsap } from "@/utils/gsap";
import { useGSAP } from "@gsap/react";
import Container from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site.config";
import ProductIcon from "@/components/common/ProductIcon";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

export const Intro = () => {
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery(`(max-width: ${layoutConfig.maxMobileWidth})`);
  const token = useAuth();
  const firstSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useGSAP(() => {
    if (!mounted) return;
    const tl = gsap.timeline();
    if (isMobile){
      gsap.from("#logo > :nth-child(1)", { opacity: 0, x: -20, duration: 0.8, ease: "power3.out" });
      gsap.from("#logo > :nth-child(2)", { opacity: 0, x: 20, duration: 0.8, stagger: 0.15, ease: "power3.out" });
    }

    tl.from("#intro", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out"
    }).from("#intro > *", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.15,
    });

    const tl1 = gsap.timeline({
      scrollTrigger: "#first-section"
    });
    tl1.from("#first-section", {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out"
    }).from("#first-section div > *", {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.15,
    });
  }, [mounted]);
  
  // пока не смонтировался клиент, не рендерим секцию с динамической высотой
  if (!mounted) return null;

  

  const height = isMobile ? "100vh" : `calc(100vh - ${layoutConfig.headerHeight})`;

  return (
    <Container>
      <section style={{ height }} className="section">
        <div className="md:hidden w-full">
          <div id="logo" className="flex text-center text-2xl my-12 gap-2">
            <ProductIcon className={""} />
            <div className="font-bold">{siteConfig.title}</div>
          </div>
          <div className="h-[1px] w-full bg-gray-200"></div>
        </div>

        <div className="h-full md:pt-12 w-full">
          <div
            id="intro"
            className="mx-auto md:mr-auto py-24 w-full flex flex-col justify-between md:h-auto gap-12 h-full rounded-3xl bg-white/80 px-2 md:px-32 md:shadow-sm backdrop-blur dark:bg-gray-800/70"
          >
            <span className="inline-block rounded-full bg-[var(--main-color)]/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-regular-text-color">
              Стартуем вместе
            </span>
            <h1 className="text-5xl font-semibold text-regular-text-color sm:text-5xl md:mx-4">
              Добро пожаловать в {siteConfig.title}
            </h1>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-200">
              Здесь вы сможете исследовать демо-сервис, попробовать регистрацию и авторизацию, а затем продолжить работу
              над своими проектами в комфортном темпе.
            </p>
            <Link href={token ? "/home" : "/register"}>
              <Button>{token ? "Перейти в каталог" : "Создать аккаунт"}</Button>
            </Link>
          </div>
        </div>
      </section>

      <section id="first-section" className="section p-4 flex items-center py-12" ref={firstSectionRef}>
        <div className="h-[70vh] flex justify-between flex-col">
          <h1 className="text-4xl font-semibold text-regular-text-color sm:text-5xl mt-12">
            Text Text Text Text
          </h1>
          <p className="text-base leading-relaxed text-gray-600 dark:text-gray-200 mt-6">
            Здесь вы сможете исследовать демо-сервис, попробовать регистрацию и авторизацию, а затем продолжить работу
            над своими проектами в комфортном темпе.
          </p>
          <div className="flex flex-col gap-4 md:gap-8 mt-4 w-full">
            {siteConfig.firstSectionItems.map((item, index) => (
              <div key={index} className="w-full rounded-xl p-4 bg-[var(--form-background-color)]">
                <div className="font-bold font-lg">{item}</div>
              </div>
            ))}
          </div>
          <div className="w-full flex justify-center">
            <Link href={token ? "/home" : "/register"}>
              <Button>{token ? "Перейти в каталог" : "Попробовать"}</Button>
            </Link>
          </div>
        </div>
      </section>
    </Container>
  );
};
