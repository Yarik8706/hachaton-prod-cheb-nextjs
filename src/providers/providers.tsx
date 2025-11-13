'use client'

import { ThemeProvider } from './ThemeProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {ReactNode, useMemo} from 'react'
import AuthProvider from "@/providers/AuthProvider";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute='class'
        defaultTheme='light'
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}