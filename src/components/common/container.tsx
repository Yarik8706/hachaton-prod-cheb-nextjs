"use client"

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export default function Container({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<div className={cn('mx-auto ' +
			'max-w-5xl px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32', className)}>{children}</div>
	)
}
