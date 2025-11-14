'use client'

import { Button } from '@/components/ui/button'
import {
	Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card'
import {
	Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/api/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { siteConfig } from "@/config/site.config"
import { useAuth } from "@/providers/AuthProvider"
import { HOME_URL } from '@/consts/consts'
import YandexButton from '@/components/utils/YandexButton'

const formSchema = z.object({
	email: z
		.string({ message: 'Укажите email' })
		.email('Неверный формат email'),
	password: z.string().min(6, {
		message: 'Укажите пароль не менее 6 символов',
	}),
})

export default function AuthForm() {
	const { push } = useRouter()
	const { setToken, tokenUpdate } = useAuth()
	const [error, setError] = useState<string | null>(null)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
		mode: 'onChange',
	})

	const { mutateAsync: login } = useMutation({
		mutationFn: async (data: z.infer<typeof formSchema>) =>
			await api.post('/api/v1/auth/log-in', {
				email: data.email,
				password: data.password,
			}),
	})

	async function onSubmit(data: z.infer<typeof formSchema>) {
		setError(null)

		await login(data)
			.then(response => {
				const accessToken = response.headers["authorization"]?.split(" ")[1];
				if (accessToken) {
					setToken(accessToken);
					tokenUpdate();
				}
				push(HOME_URL)
				toast('Успешный вход')
			})
			.catch(err => {
				if (err.status == 401) {
					setError("Неверный email или пароль")
				}
				if (err.status === 404) {
					toast('Пользователь не найден')
				}
			})
	}

	return (
		<div className='px-2 w-full md:w-auto'>
			<Card className='w-auto md:w-[475px]'>
				<CardHeader>
					<Link href='/' className='mb-5 flex items-center gap-1 text-sm'>
						<ArrowLeft className='stroke-black dark:stroke-white' width={16} height={16}/>
						<p>Назад</p>
					</Link>

					<CardDescription className='text-sm text-gray-400'>
						{siteConfig.title}
					</CardDescription>

					<CardTitle className='mb-4 text-2xl font-bold'>
						Добро пожаловать!
					</CardTitle>

					<CardDescription className='text-sm text-gray-400'>
						Войдите в свой аккаунт
					</CardDescription>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} id='login-form'>
							<div className='flex flex-col gap-4'>

								<FormField
									control={form.control}
									name='email'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input placeholder='Введите email' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='password'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Пароль</FormLabel>
											<FormControl>
												<Input type='password' placeholder='Введите пароль' {...field}/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

							</div>
						</form>
					</Form>

					{error && <p className="text-red-400">{error}</p>}
				</CardContent>

				<CardFooter className='flex flex-col gap-2'>
					<Button type='submit' form='login-form' className='w-full'>Войти</Button>

					<Link href='/register' className='w-full'>
						<Button variant='secondary' className='w-full'>
							Зарегистрироваться
						</Button>
					</Link>

					<YandexButton />
				</CardFooter>
			</Card>
		</div>
	)
}
