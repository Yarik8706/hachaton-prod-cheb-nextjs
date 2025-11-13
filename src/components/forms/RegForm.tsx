'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
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
import {siteConfig} from "@/config/site.config";
import {useAuth} from "@/providers/AuthProvider";
import {useProfile} from "@/store/profile.store";
import {usePartners} from "@/store/partners.store";

// ✅ Добавлено поле fullname в схему валидации
const formSchema = z.object({
	username: z
		.string({
			message: 'Укажите логин',
		})
		.regex(/[a-zA-Z0-9_.-]/, 'Только латинские буквы'),
	password: z.string().min(6, {
		message: 'Укажите пароль длиною не менее 6 символов',
	}),
})

export default function RegForm() {
	const { push } = useRouter()
	const {setToken, tokenUpdate} = useAuth();
	const {fetchProfile} = useProfile()
	const {fetchPartners} = usePartners()

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: '',
			password: '',
		},
		mode: 'onChange',
	})

	const { mutateAsync: register } = useMutation({
		mutationFn: async (data: z.infer<typeof formSchema>) =>
			await api.post('/api/v1/auth/register', {
				username: data.username,
				password: data.password,
			}),
		onSuccess: () => {
			
			toast('Успешная регистрация')
			push('/home')
		},
		onError: () => {
			toast('Ошибка регистрации')
		}
	})

	async function onSubmit(data: z.infer<typeof formSchema>) {
		await register(data)
			.then(response => {
				const accessToken = response.headers["authorization"]?.split(" ")[1];
				if (accessToken) {
					setToken(accessToken);
					tokenUpdate()
				}
			})
			.catch(err => {
				if (err.status === 409) {
					toast('Данный пользователь уже зарегистрирован')
				}
			})
	}

	return (
		<div className="px-2 w-full md:w-auto">
			<Card className='w-auto md:w-[475px] lg:w-[475px]'>
				<CardHeader>
					<CardDescription className='mb-2 text-sm'>
						<Link
							href='/home'
							className='mb-5 flex w-full cursor-pointer items-center gap-1 text-sm'
						>
							<ArrowLeft
								className='stroke-black dark:stroke-white'
								width={16}
								height={16}
								color='black'
							/>
							<p className='text-black dark:text-white'>Назад</p>
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
								{/* Логин */}
								<div className='flex flex-col gap-2 space-y-1.5'>
									<FormField
										control={form.control}
										name='username'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Логин</FormLabel>
												<FormControl>
													<Input placeholder='Введите логин' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Пароль */}
								<div className='flex flex-col gap-2 space-y-1.5'>
									<FormField
										control={form.control}
										name='password'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Пароль</FormLabel>
												<FormControl>
													<Input
														placeholder='Введите пароль'
														type='password'
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</form>
					</Form>
				</CardContent>
				<CardFooter className='mt-3 flex flex-col gap-2'>
					<Button type='submit' form='reg-form' className='w-full'>
						Зарегистрироваться
					</Button>
				</CardFooter>
			</Card>
		</div>
		
	)
}
