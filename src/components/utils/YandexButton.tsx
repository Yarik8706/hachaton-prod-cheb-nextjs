"use client"

import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { CLIENT_ID, YANDEX_AUTH_URL } from '@/consts/consts'
import { api } from '@/api/api'

export default function YandexButton() {
	const { replace, push } = useRouter()

	const params = useSearchParams()

	useEffect(() => {
		const code = params.get('code')

		if (code) {
			api
				.post('/auth/get_token', { code })
				.then(res => {
					localStorage.setItem('access_token', res.data.access_token)
					push('/')
				})
				.catch(err => console.error('Ошибка авторизации:', err))
		}
	}, [params, push])

	const handleLogin = () => {
		const authUrl = `${YANDEX_AUTH_URL}?response_type=code&client_id=${CLIENT_ID}`
		replace(authUrl)
	}

  return (
		<Button
			className='mt-6 flex w-full items-center justify-between gap-4 rounded-lg bg-black hover:bg-[#555555] dark:bg-white dark:hover:bg-[#EEE]'
			onClick={handleLogin}
		>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				width='44'
				height='44'
				viewBox='0 0 44 44'
				fill='none'
				className='size-6 rounded-full bg-red-500'
			>
				<rect width='44' height='44' fill='%23FC3F1D' />
				<path
					d='M24.7407 33.9778H29.0889V9.04443H22.7592C16.3929 9.04443 13.0538 12.303 13.0538 17.1176C13.0538 21.2731 15.2187 23.6163 19.0532 26.1609L21.3832 27.6987L18.3927 25.1907L12.4667 33.9778H17.1818L23.5115 24.5317L21.3098 23.0671C18.6496 21.2731 17.3469 19.8818 17.3469 16.8613C17.3469 14.2068 19.2183 12.4128 22.7776 12.4128H24.7223V33.9778H24.7407Z'
					fill='white'
				/>
			</svg>
			<p className='text-white dark:text-black'>Войти через Яндекс</p>
			<div className='size-6' />
		</Button>
  );
  
}