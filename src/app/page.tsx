"use client"

import YandexButton from '@/components/utils/YandexButton'
import { useAuth } from '@/providers/AuthProvider'
import Container from '@/components/common/container'
import { Header } from '@/components/layout/Header'

export default function Home() {
  
  const {isAuth} = useAuth()
  
  return (
    <main>
      <Header/>
      <Container className="flex flex-col items-center justify-center h-screen">
        {isAuth ? <div>Авторизован</div> : <div>Не авторизован</div>}
        <div className="w-[300px]"><YandexButton/></div>
      </Container>
      
      
      {/*<Intro />*/}
      {/*<Footer />*/}
    </main>
  );
}
