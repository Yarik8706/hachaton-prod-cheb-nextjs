"use client"

import {Header} from "@/components/layout/Header";
import {BottomNav} from "@/components/layout/BottomNav";
import Container from "@/components/common/container";
import { Suspense, useEffect } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from "next/navigation";

interface IProps {
  children: React.ReactNode
}

const Layout: React.FC<IProps> = ({ children }: IProps) => {
  const {isAuth} = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuth) {
      router.push('/login')
    }
  }, [])
  
  return (
    <div className="bg-[var(--second-background-color)] min-h-[100vh]">
      <Header/>
      <>
        <Container className="px-2">
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