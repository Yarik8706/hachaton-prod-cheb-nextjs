'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from "@/lib/utils"

interface IProps {
  className: string
}

export function ToggleTheme({className}: IProps) {
  const { setTheme, theme } = useTheme()

  return (
    <button
      onClick={() => {
        if (theme === 'dark') setTheme('light')
        else setTheme('dark')
      }}
      
      className={cn('ml-4 w-12 h-12 cursor-pointer flex items-center justify-center', className)}
    >
      <Sun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
      <Moon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
      <span className='sr-only'>Toggle theme</span>
    </button>
  )
}
