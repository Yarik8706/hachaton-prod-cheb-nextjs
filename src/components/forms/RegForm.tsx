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
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { siteConfig } from "@/config/site.config"
import { useAuth } from "@/providers/AuthProvider"
import SetInterests from '@/components/forms/SetInterests'
import { useState } from 'react'

const formSchema = z.object({
	email: z.string().email("Укажите корректный email"),
	password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
})

export default function RegForm() {
	const { push } = useRouter()
	const { setToken, tokenUpdate } = useAuth()

	const [interests, setInterests] = useState<string[]>([]);
	const [value, setValue] = useState("");

	const addInterest = () => {
		const v = value.trim();
		if (!v) return;
		setInterests(prev => [...prev, v]);
		setValue("");
	};

	const removeInterest = (i: number) =>
		setInterests(prev => prev.filter((_, idx) => idx !== i));

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { email: '', password: '' },
		mode: 'onChange',
	})

	const { mutateAsync: registerFn } = useMutation({
		mutationFn: async (data: z.infer<typeof formSchema>) =>
			await api.post('/api/v1/auth/register', {
				email: data.email,
				password: data.password,
				interests: interests,
			}),
		onSuccess: () => {
			toast("Успешная регистрация")
			push('/home')
		},
		onError: () => toast("Ошибка регистрации")
	})

	async function onSubmit(data: z.infer<typeof formSchema>) {
		await registerFn(data)
			.then(response => {
				const accessToken = response.headers["authorization"]?.split(" ")[1];
				if (accessToken) {
					setToken(accessToken);
					tokenUpdate();
				}
			})
			.catch(err => {
				if (err.status === 409) toast("Email уже зарегистрирован");
			})
	}

	return (
		<div className="px-2 w-full md:w-auto">
			<Card className='w-auto md:w-[475px]'>
				<CardHeader>
					<CardDescription className='mb-2 text-sm'>
						<Link href='/home' className='flex items-center gap-1'>
							<ArrowLeft className='stroke-black dark:stroke-white' width={16} height={16}/>
							<p>Назад</p>
						</Link>
					</CardDescription>

					<CardTitle className='mb-4'>Регистрация</CardTitle>
					<CardDescription className='text-sm text-gray-400'>
						{siteConfig.description}
					</CardDescription>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} id='reg-form'>
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
											<FormMessage/>
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
												<Input type="password" placeholder='Введите пароль' {...field}/>
											</FormControl>
											<FormMessage/>
										</FormItem>
									)}
								/>

								<div className="text-sm text-gray-600 py-2">Укажите ваши интересы, например (Python, бэкенд, дизайн т.д.):</div>
								<SetInterests
									value={value}
									setValue={setValue}
									interests={interests}
									addInterest={addInterest}
									removeInterest={removeInterest}
								/>

							</div>
						</form>
					</Form>
				</CardContent>

				<CardFooter className='flex flex-col gap-2'>
					<Button type='submit' form='reg-form' className='w-full'>
						Зарегистрироваться
					</Button>
				</CardFooter>

			</Card>
		</div>
	)
}
