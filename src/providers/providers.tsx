'use client'

import { ThemeProvider } from './ThemeProvider'
import {ReactNode, useMemo} from 'react'
import AuthProvider from "@/providers/AuthProvider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GlobalInterestsDialog } from '@/components/dialogs/GlobalInterestsDialog';
import LoadDataProvider from '@/providers/LoadDataProvider'

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
          <LoadDataProvider>
            {children}
            <GlobalInterestsDialog />
          </LoadDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}