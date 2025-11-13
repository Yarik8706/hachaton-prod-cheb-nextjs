'use client'

import { api } from '@/api/api'
import { useMutation } from '@tanstack/react-query'
import Cookies from 'js-cookie'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

interface IProps {
	provider : string
}

export default function Token({ provider } : IProps) {
	const searchParams = useSearchParams()
	const { push } = useRouter()

	const code = searchParams.get('code')

	const { mutateAsync } = useMutation({
		mutationFn: async (code: string) => {
			return await api.post('/auth/get_token', {
				code,
			})
		},
	})

	useEffect(() => {
		mutateAsync(code!).then(response => {
			if (response.data.token) {
				Cookies.set('token', response.data.token)
				push('/')
			}
		})
	}, [])

	return null
}
