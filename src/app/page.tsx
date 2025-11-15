"use client"

import { Header } from '@/components/layout/Header'
import { Intro } from '@/components/layout/Intro'
import { Footer } from '@/components/layout/Footer'

export default function Home() {
  return (
    <main>
      <Header/>
      <Intro />
      <Footer />
    </main>
  );
}
