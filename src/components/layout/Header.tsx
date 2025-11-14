'use client'

import Container from '@/components/common/container'
import Link from 'next/link'
import ProductIcon from '../common/ProductIcon'
import {layoutConfig} from "@/config/layout.config";
import { usePathname } from 'next/navigation'
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {useAuth} from "@/providers/AuthProvider";
import { siteConfig } from '@/config/site.config'

export function Header() {

  const {isAuth} = useAuth()
  const pathname = usePathname()

  console.log(isAuth)

  return (
    <header style={{height: layoutConfig.headerHeight}}
            className={`gap-8 bg-white shadow-sm p-5 dark:bg-black hidden md:block`}>
      <Container className='px-0'>
        <main className='flex items-center justify-between'>
          <div className="flex flex-[3] gap-8 justify-between">
            <Link href={'/'} className='flex flex-row items-center gap-2'>
              <ProductIcon className=""/>
              <div className="font-bold">{siteConfig.title}</div>
            </Link>
            {isAuth && (
              <div className="flex gap-10">
                {layoutConfig.navItems.map((item) => {
                  const active = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex flex-col items-center text-sm transition",
                        active ? "text-black" : "text-gray-500 hover:text-gray-800"
                      )}
                    >
                      <span className="text-lg mt-1">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          {!isAuth && <div className="flex flex-[2] justify-end gap-4">
            <Link href={'/register'}>
              <Button variant="secondary"
                      className="hover:bg-gray-200 transition duration-300 shadow-none">Зарегистрироваться</Button>
            </Link>
            <Link href={'/login'}>
              <Button className="shadow-none">Войти</Button>
            </Link>
          </div>}

        </main>
      </Container>
    </header>
  )
}
