"use client"

import {Header} from "@/components/layout/Header";
import {BottomNav} from "@/components/layout/BottomNav";
import Container from "@/components/common/container";
import PageTransitionAnimation from "@/components/common/PageTransitionAnimation";
import {Footer} from "@/components/layout/Footer";
import { Suspense } from 'react'

interface IProps {
  children: React.ReactNode
}

const Layout: React.FC<IProps> = ({ children }: IProps) => {
  return (
    <div className="bg-[var(--second-background-color)] min-h-[100vh]">
      <Header/>
      <>
        <Container>
          <Suspense>
            {children}
          </Suspense>
        </Container>
      </>
      <BottomNav/>
    </div>
  )
}

export default Layout