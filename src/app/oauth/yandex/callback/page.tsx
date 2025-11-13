'use client'

import { Suspense } from 'react'
import Token from "@/components/utils/Token";

export default function TokenPage() {
	return (
		<Suspense>
			<Token provider="yandex" />
		</Suspense>
	)
}