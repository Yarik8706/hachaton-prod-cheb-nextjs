"use client"

import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {Intro} from "@/components/layout/Intro";
import { useAuth } from '@/providers/AuthProvider'
import YandexButton from '@/components/utils/YandexButton'

export default function Home() {
  
  const {isAuth} = useAuth()
  
  return (
    <>
      {!isAuth && <YandexButton/>}
      {/*<Header/>*/}
      {isAuth && <Intro />}
      {/*<Footer />*/}
    </>
  );
}
